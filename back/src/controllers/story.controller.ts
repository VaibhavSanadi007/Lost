import { Request, Response } from "express";
import imagekit from "../services/imagekit.services.js";
import storyModel from "../models/story.model.js";
import followModel from "../models/follow.model.js";
import { Types } from "mongoose";

export const addStoryFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const userFile = req.file;

    if (!userFile?.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResponse:any = await imagekit.upload({
      file: userFile?.buffer!,
      fileName: userFile?.originalname as string,
      folder: "/social/",
    });
   

    if (uploadResponse.fileType === "image") {
      const maxWidth = 10000;
      const maxHeight = 10000;

      const minWidth = 100;
      const minHeight = 100;

      if (uploadResponse.width < minWidth || uploadResponse.height < minHeight || uploadResponse.width > maxWidth || uploadResponse.height > maxHeight) {
        await imagekit.deleteFile(uploadResponse.fileId);
        return res
          .status(400)
          .json({ error: "Image dimensions too large or too small" });
      }
    }

    if (uploadResponse.fileType === "non-image") {
      const maxSize = 50 * 1024 * 1024; 
      const allowedVideoCodec = "h264";
      const allowedAudioCodec = "aac";

      if (
        uploadResponse.videoCodec !== allowedVideoCodec ||
        uploadResponse.audioCodec !== allowedAudioCodec
      ) {
        await imagekit.deleteFile(uploadResponse.fileId);
        return res.status(400).json({
          error:
            "Unsupported video format. Use MP4 with H.264 video and AAC audio.",
        });
      }

      if (uploadResponse.size > maxSize) {
        await imagekit.deleteFile(uploadResponse.fileId);
        return res.status(400).json({ error: "Video file too large" });
      }
    }

    const storyDocs = new storyModel({
      ownerId: userId,
      mediaUrl: uploadResponse.url,
      storytype: uploadResponse.fileType === 'image'?'image':'video',
      duration: uploadResponse.fileType === 'image'? 5 : 30,
    });

    const data = await storyDocs.save();

    res.json({
      message: "File story created successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

    const {StoryId} = req.params;
   
    const data = await storyModel.findOneAndDelete({
      _id:StoryId,
      ownerId: userId,
    });
   
    res.json({
      message: "story deleted successful! 🎉",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
