import { json, Request, Response } from "express";
import userModel, { IUser } from "../models/user.model.js";
import redis from "../databases/redis.js";
import followModel from "../models/follow.model.js";
import cloudinary from "../services/imagekit.services.js";
import streamifier from 'streamifier';
type getObj = {
  username: string;
  email: string;
  name: string;
  description?: string;
  tags?: string[];
  role: string;
};

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const data = await userModel
      .findById(userId)
      .select("username email name description tags role dp privateMode");

    if (!data) {
      return res.status(400).json({
        message: "user data not available in db",
      });
    }

    const isUserInRedis: number = await redis.exists(userId);

    if (isUserInRedis) {
      const userData = await redis.get(userId);
      const data: getObj = JSON.parse(userData as string);

      return res.status(200).json({
        message: "user data retrieved successfully",
        data,
      });
    }

    redis.set(userId, JSON.stringify(data), "EX", 600);

    res.status(200).json({
      message: "user data retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const { username, email, name, description, tags } = req.body;
    const userFile = req.file;
    const userId = req.params.id;

    let dpUrl: string | undefined = undefined;

    // 🔹 Upload new profile picture if provided
    if (userFile?.buffer) {
      const uploadResponse: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "profile_pics",
            resource_type: "image", // profile pictures are always images
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(userFile.buffer).pipe(uploadStream);
      });

      dpUrl = uploadResponse.secure_url;
    }

    // 🔹 Update user in DB
    const data = await userModel.findByIdAndUpdate(
      userId,
      {
        username,
        email,
        name,
        description,
        tags,
        ...(dpUrl && { dp: dpUrl }),
      },
      { new: true }
    );

    if (!data) {
      return res.status(400).json({ message: "Update unsuccessful" });
    }

    res.status(200).json({
      success: true,
      message: "Update successful 🎉",
      data,
    });
  } catch (error: any) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const deleteUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const data = await userModel.findByIdAndDelete(userId);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });

    res.status(201).json({
      message: "delete successfull",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const isUserExist = await followModel.findOne({
      followerId: userId,
      followingId: req.user?._id,
    });

    if (isUserExist) {
      return res.status(400).json({ message: "already follows user" });
    }

    const followData = new followModel({
      followingId: req.user?._id,
      followerId: userId,
    });
    await followData.save();

    const data = await followData.populate(
      "followingId followerId",
      "_id username"
    );

    return res.status(200).json({ message: "follow successfull", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const UnfollowUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const isUserExist = await followModel.findOne({
      followerId: userId,
      followingId: req.user?._id,
    });

    if (!isUserExist) {
      return res.status(400).json({ message: "already Unfollows user" });
    }

    const followData = await followModel.findOneAndDelete({
      followerId: userId,
      followingId: req.user?._id,
    });

    const data = await followData?.populate(
      "followingId followerId",
      "_id username"
    );

    return res.status(200).json({ message: "Unfollow successfull", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getfollowers = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const data = await followModel
      .find({ followerId: userId })
      .populate("followingId", "_id username name dp description");

    if (data.length === 0) {
      return res.status(200).json({ message: "No followers :) " });
    }

    res.status(200).json({ message: "followers retrived successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getfollowing = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const data = await followModel
      .find({ followingId: userId })
      .populate("followerId", "_id username name dp description");

    if (data.length === 0) {
      return res.status(200).json({ message: "No following :) " });
    }

    res.status(200).json({ message: "following retrived successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const data = await userModel
      .findById(userId)
      .select("username email name description tags role dp ");

    if (!data) {
      return res.status(400).json({
        message: "user data not available in db",
      });
    }
    res.status(200).json({
      message: "user data retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getRecommendFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    const followingData = await followModel
      .find({ followingId: userId })
      .populate("followerId", "_id username").select('followerId');

    const userData = await userModel.find({
      _id: { $ne: userId },
    }).select('_id username dp name description').lean<IUser[]>().limit(10);

    
    const followerIds: string[] = followingData.map(i => i.followerId._id.toString());

    const data = userData.filter(u => !followerIds.includes(u._id.toString() as string ));
    
    res.status(200).json({
      message: "user data retrieved successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const searchUser = async (req: Request, res: Response) => {
   try {
    
    const {query} = req.query;

    if(!query || query===''){
      return res.status(400).json({ message: "Query is required" });
    }

    const data = await userModel.find({
     $or: [ 
      {username: {$regex: query, $options: "i"} }, 
      { name: {$regex: query, $options: "i"} }
    ],
    }).select("name username dp");

    res.status(200).json({
      message: "user data retrieved successfully",
      data
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

