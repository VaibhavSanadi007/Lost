import { Request, Response } from "express";
import cloudinary from "../services/imagekit.services.js";
import storyModel from "../models/story.model.js";
import followModel from "../models/follow.model.js";
import streamifier from 'streamifier';
import { Types } from "mongoose";
import {imageSize} from 'image-size';

export const addStoryFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const userFile = req.file;

    if (!userFile?.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadToCloudinary = (): Promise<any> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "stories",
            resource_type: "auto", 
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(userFile.buffer).pipe(uploadStream);
      });
    };

    const uploadResponse = await uploadToCloudinary();

    const isImage = uploadResponse.resource_type === "image";
    const isVideo = uploadResponse.resource_type === "video";

    if (isImage) {
      const dimensions = imageSize(userFile.buffer);
      const { width = 0, height = 0 } = dimensions;

      const maxWidth = 10000;
      const maxHeight = 10000;
      const minWidth = 100;
      const minHeight = 100;

      if (
        width < minWidth ||
        height < minHeight ||
        width > maxWidth ||
        height > maxHeight
      ) {
        await cloudinary.uploader.destroy(uploadResponse.public_id);
        return res.status(400).json({
          error: "Image dimensions too large or too small",
        });
      }
    }

    if (isVideo) {
      const maxSize = 50 * 1024 * 1024; 
      const fileSize = userFile.size;

      if (fileSize > maxSize) {
        await cloudinary.uploader.destroy(uploadResponse.public_id);
        return res.status(400).json({ error: "Video file too large" });
      }

    }

    const storyDoc = new storyModel({
      ownerId: userId,
      mediaUrl: uploadResponse.secure_url,
      storytype: isImage ? "image" : "video",
      duration: isImage ? 5 : 30,
    });

    const data = await storyDoc.save();
    console.log(data)
    res.status(200).json({
      success: true,
      message: "Story created successfully 🎉",
      data,
    });
  } catch (error: any) {
    console.error("Story upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addStorytext = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const {storytype,storytext,duration} = req.body;

    const storyDocs = new storyModel({
      ownerId: userId,
      storytype,
      storytext,
      duration,
    });

    const data = await storyDocs.save();

    res.json({
      message: "text story created successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeedStories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const now = new Date();

const UserFollowingData = await followModel
  .find({ followingId: userId })
  .select('followerId')
  .populate('followerId', 'username');


  const followingArr:Types.ObjectId[] = UserFollowingData.map((item)=>{
    return item.followerId._id;
  })
  followingArr.push(userId!);


  const data = await storyModel.find({
      ownerId: {$in: followingArr},
      expiresAt: {$gt: now},
    }).sort({createdAt:-1}).populate('ownerId','dp name');
   
    res.json({
      message: "story retreived successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteStory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { StoryId } = req.params;

    const story = await storyModel.findOne({
      _id: StoryId,
      ownerId: userId,
    });

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.mediaUrl) {
   
      const publicId = story.mediaUrl.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(`stories/${publicId}`, {
        resource_type: "auto",
      });
    }

    const deletedStory = await storyModel.findByIdAndDelete(StoryId);

    res.status(200).json({
      success: true,
      message: "Story deleted successfully 🎉",
      data: deletedStory,
    });
  } catch (error: any) {
    console.error("Delete story error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};