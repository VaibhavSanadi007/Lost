import { Request, Response } from "express";
import mongoose from "mongoose";
import redis from "../databases/redis.js";
import commentModel from "../models/comment.model.js";

export const createComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postid;
    const {commentText} = req.body;

    const userObjectId = mongoose.Types.ObjectId.createFromHexString(req.user?._id?.toString() as string);

    const commentData = new commentModel({
      commentUserId: userObjectId,
      postId: new mongoose.Types.ObjectId(postId),
      commentText,
    })
    
    await commentData.save();

    const data = await commentData.populate('commentUserId','username name dp');

     res.json({
      success: true,
      message: "comment added successfully! 🎉",
      data,
    });

  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};


export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postid;

    const isDataAvailable = await redis.exists('comment:'+postId);

    if(isDataAvailable){
      const cachedData = await redis.get('comment:'+postId);
      const data = cachedData? JSON.parse(cachedData) : null;
      return  res.json({
      success: true,
      message: "comment fetched successfully! 🎉",
      data,
    });
    }

    const data = await commentModel.find({postId}).sort({createdAt:-1}).populate('commentUserId','username name dp');
    const cleanData = JSON.stringify(data);
    await redis.set('comment:'+postId,cleanData,'EX',10);

     res.json({
      success: true,
      message: "comment fetched successfully! 🎉",
      data,
    });

  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};


export const editComments = async (req: Request, res: Response) => {
  try {
    const commentid = req.params.commentid;
    const {commentText} = req.body;

    const data = await commentModel.findOneAndUpdate({_id:commentid,commentUserId:req.user?._id},{commentText},{new:true}).populate('commentUserId','username');

    if(!data){
      return res.json({
      success: true,
      message: "comment not edited successfully! 🎉",
      data,
    });
    }

     res.json({
      success: true,
      message: "comment edited successfully! 🎉",
      data,
    });

  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

export const deleteComments = async (req: Request, res: Response) => {
  try {
    const commentid = req.params.commentid;

    const data = await commentModel.findOneAndDelete({_id:commentid,commentUserId:req.user?._id});

    if(!data){
      return res.json({
      success: true,
      message: "comment not deleted successfully! 🎉",
      data,
    });
    }

     res.json({
      success: true,
      message: "comment deleted successfully! 🎉",
      data,
    });

  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};