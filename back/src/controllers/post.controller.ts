import { Request, Response } from "express";
import imagekit from "../services/imagekit.services.js";
import postModel from "../models/post.model.js";
import redis from "../databases/redis.js";
import { imageSize } from "image-size";
import generateCaption from "../services/ai_caption.service.js";

// import imageCompression from "browser-image-compression";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { postDescription, postTags, postType } = req.body;

    if (!req.file?.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (postType === "Image") {
      const dimensions = imageSize(req.file.buffer);

      
      const maxWidth = 10000;
      const maxHeight = 10000;
      
      const minWidth = 100;
      const minHeight = 100;
      
      if (
        dimensions.width < minWidth ||
        dimensions.height < minHeight ||
        dimensions.width > maxWidth ||
        dimensions.height > maxHeight
      ) {
        return res
          .status(400)
          .json({ error: "Image dimensions too large or too small" });
        }
      }
      
      const userFile = req.file;
      
      if (!userFile) {
        return res.status(400).json({ message: "no file uploaded " });
      }
      
      // const options = {
      //   maxSizeMB: 2, // compress to around 2MB
      //   maxWidthOrHeight: 1920,
      //   useWebWorker: true,
      // };

      // const compressedFile = await imageCompression(userFile,options);

    const ArrayOfPost = postTags.split(" ");

    const uploadResponse = await imagekit.upload({
      file: userFile?.buffer!,
      fileName: userFile?.originalname as string,
      folder: "/social/",
    });

    const data = await postModel.create({
      postUserId: req.user?.id,
      postId: uploadResponse.fileId,
      postUrl: uploadResponse.url,
      postDescription: postDescription ? postDescription : "",
      postTags: ArrayOfPost,
      postType,
    });

    res.json({
      success: true,
      message: "File upload successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const isPostExist = await postModel.findById(postId);

    if (!isPostExist) {
      return res.status(400).json({ message: "post is not in db" });
    }

    const data = await postModel.findByIdAndDelete(postId);
    await imagekit.deleteFile(isPostExist.postId);

    res.json({
      success: true,
      message: "File deleted successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const { postDescription, postTags } = req.body;

    const ArrayOfPost = postTags ? postTags.split(" ") : [];

    const postId = req.params.id;

    const data = await postModel.findOneAndUpdate(
      { _id: postId, postUserId: req.user?.id },
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
      { $push: { like: req.user?.id } },
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
      (items: any) => items._id.toString() === req.user?.id
    );

    if (!isLikeExist) {
      return res.status(400).json({ message: "post is already unliked" });
    }

    const data = await postModel.findByIdAndUpdate(
      postId,
      { $pull: { like: req.user?.id } },
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
    const data = await postModel
      .find()
      .sort({ createdAt: -1 })
      .limit(20)
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

//under construction infinite pagination add sikhenge fir banayenge

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
