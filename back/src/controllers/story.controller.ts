import { Request, Response } from "express";
import imagekit from "../services/imagekit.services.js";
import storyModel from "../models/story.model.js";

export const addStoryFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const userFile = req.file;

    if (!userFile?.buffer) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadResponse = await imagekit.upload({
      file: userFile?.buffer!,
      fileName: userFile?.originalname as string,
      folder: "/social/",
    });

    console.log(uploadResponse)

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
