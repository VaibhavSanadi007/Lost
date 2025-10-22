import { Request, Response } from "express";
import cloudinary from "../services/imagekit.services.js";
import postModel from "../models/post.model.js";
import redis from "../databases/redis.js";
import { imageSize } from "image-size";
import generateCaption from "../services/ai_caption.service.js";
import followModel from "../models/follow.model.js";
import streamifier from "streamifier";


export const createPost = async (req: Request, res: Response) => {
  try {
    const { postDescription, postTags, postType } = req.body;
    const userFile = req.file;

    if (!userFile || !userFile.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (postType === "Image") {
      const dimensions = imageSize(userFile.buffer);
      const { width = 0, height = 0 } = dimensions;

      if (width < 100 || height < 100 || width > 10000 || height > 10000) {
        return res.status(400).json({ error: "Image dimensions too large or too small" });
      }
    }

    const ArrayOfPost = postTags ? postTags.split(" ") : [];

    const uploadToCloudinary = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "posts",
            resource_type: "auto", 
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(userFile.buffer).pipe(uploadStream);
      });
    };

    const result = await uploadToCloudinary();

    const data = await postModel.create({
      postUserId: req.user?._id,
      postId: result.public_id,
      postUrl: result.secure_url,
      postDescription: postDescription || "",
      postTags: ArrayOfPost,
      postType,
    });

    res.status(200).json({
      success: true,
      message: "File upload successful 🎉",
      data,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const isPostExist = await postModel.findById(postId);

    if (!isPostExist) {
      return res.status(404).json({ message: "Post not found in database" });
    }

    if (isPostExist.postId) {
      await cloudinary.uploader.destroy(isPostExist.postId);
    }

    const deletedPost = await postModel.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post and Cloudinary file deleted successfully 🎉",
      data: deletedPost,
    });
  } catch (error: any) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const { postDescription, postTags } = req.body;

    const ArrayOfPost = postTags ? postTags.split(" ") : [];

    const postId = req.params.id;

    const data = await postModel.findOneAndUpdate(
      { _id: postId, postUserId: req.user?._id },
      { $set: { postDescription, postTags: ArrayOfPost } },
      { new: true }
    );

    if (!data) {
      return res.status(400).json({ message: "post is not in db" });
    }

    res.json({
      success: true,
      message: "File updated successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error 1", error });
  }
};

export const LikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;

    const LikeObj = await postModel.findById(postId).select("like");

    const isLikeExist = LikeObj?.like.find(
      (items: any) => items._id.toString() === req.user?._id
    );

    if (isLikeExist) {
      return res.status(400).json({ message: "like already exist" });
    }

    const data = await postModel.findByIdAndUpdate(
      postId,
      { $push: { like: req.user?._id } },
      { new: true }
    );

    res.json({
      success: true,
      message: "like updated successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const UnLikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    
    const LikeObj = await postModel.findById(postId).select("like");

    const isLikeExist = LikeObj?.like.find(
      (items: any) => items._id.toString() === req.user?._id.toString()
    );
 
    if (!isLikeExist) {
      return res.status(400).json({ message: "post is already unliked" });
    }

    const data = await postModel.findByIdAndUpdate(
      postId,
      { $pull: { like: req.user?._id } },
      { new: true }
    );

    res.json({
      success: true,
      message: "unlike updated successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const usersLikePost = async (req: Request, res: Response) => {
  try {
    const postID = req.params.id;

    const isDataAvailable = await redis.exists(postID);
    if (isDataAvailable) {
      const cachedData = await redis.get("post:" + postID);
      const data = cachedData ? JSON.parse(cachedData) : null;

      return res.json({
        success: true,
        message: "like list successful! 🎉",
        data,
      });
    }

    const data = await postModel
      .findById(postID)
      .select("like")
      .populate("like", "username name updatedAt dp");

    const cleanData = JSON.stringify(data);

    redis.set("post:" + postID, cleanData, "EX", 600);

    res.json({
      success: true,
      message: "like list successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getuserPosts = async (req: Request, res: Response) => {
  try {
    const userID = req.params.id;

    const isDataAvailable = await redis.exists("users_post:" + userID);
    if (isDataAvailable) {
      const cachedData = await redis.get("users_post:" + userID);

      const data = cachedData ? JSON.parse(cachedData) : null;

      return res.json({
        success: true,
        message: "retrieved user posts successfully! 🎉",
        data,
      });
    }

    const data = await postModel
      .find({ postUserId: userID })
      .select("postUrl postDescription postTags postType")
      .sort({ createdAt: -1 });

    const cleanData = JSON.stringify(data);
    // redis.set("users_post:" + userID, cleanData, "EX", 100);

    res.json({
      success: true,
      message: "retrieved user posts successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeed = async (req: Request, res: Response) => {
  try {

    const userId = req.user?._id;
    const page = Number(req.query.page);


     const followingData = await followModel
          .find({ followingId: userId })
          .populate("followerId", "_id username").select('followerId');

    const ids = followingData.map((item)=> item.followerId._id); 
    ids.push(userId!);
    const data = await postModel
      .find({postUserId: {$in:ids}})
      .sort({ createdAt: -1 })
      .populate("postUserId", "username name dp");

    res.json({
      success: true,
      message: "retrieved feeds successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error 1", error });
  }
};


export const getCaption = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    let base64Image: string;

    if (file?.buffer) {
      base64Image = Buffer.from(file?.buffer).toString("base64");

      const caption = await generateCaption(base64Image);

      res.json({
        success: true,
        message: "caption created successfully! 🎉",
        caption,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error 1", error });
  }
};
