import { Request, Response } from "express";
import chatModel from "../models/socket.model.js";


export const getChats = async (req: Request, res: Response) => {
  const targetId = req.params.id;

  const chatData = await chatModel.find({
    participants: {$all: [req.user?._id,targetId] }
  }).sort({createdAt: 1});

  res.send(chatData);

};

