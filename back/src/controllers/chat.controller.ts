import { Request, Response } from "express";
import chatModel from "../models/socket.model.js";
import aiChatModel from "../models/Chat_ai.model.js";


export const getChats = async (req: Request, res: Response) => {
  const targetId = req.params.id;

  const chatData = await chatModel.find({
    participants: {$all: [req.user?._id,targetId] }
  }).sort({createdAt: 1});

  res.send(chatData);

};

export const getAiChats = async (req:Request , res: Response) => {
try{
  const id = req.user?._id;
  const aiChat = (await aiChatModel.find({
    user : id
  }).sort({createdAt: -1}).limit(10)).reverse();

  res.status(200).json({
    message: "fetched ai chats successfully",
    data: aiChat,
  })

}
catch(err){
  res.status(500).send(err);
}  
}
