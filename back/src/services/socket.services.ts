import { Server } from "socket.io";
import chatModel from "../models/socket.model.js";
import { createMemory, queryMemory } from "./vector.service.js";
import { generateResponse, generateVector } from "./ai_chat.service.js";
import aiChatModel from '../models/Chat_ai.model.js';

const getRoomId = (senderid: string, recieverid: string) => {
  return [senderid, recieverid].sort().join("_");
};

export const socketServer = async (httpServer: object) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.frontURL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("join_room", ({ senderid, recieverid }) => {
      const roomId = getRoomId(senderid, recieverid);
      socket.join(roomId);
    });

    socket.on("Chat", async ({ senderId, receiverId, message }) => {
      try {
        if (!message || !senderId || !receiverId) {
          throw new Error("invalid chat");
        }

        const roomId = getRoomId(senderId, receiverId);

        const createChat = new chatModel({
          senderId,
          receiverId,
          message,
          participants: [senderId, receiverId],
        });

        await createChat.save();

        const msgData = await chatModel
          .findById(createChat._id)
          .select("senderId receiverId message ");

        io.to(roomId).emit("recieveMsg", msgData);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("deleteChat", async ({ senderId, receiverId, msgId }) => {
      try {
        if (!msgId || !senderId || !receiverId) {
          throw new Error("invalid credentials");
        }

        const roomId = getRoomId(senderId, receiverId);

        await chatModel.findByIdAndDelete(msgId);

        io.to(roomId).emit("deleteMsg", msgId);
      } catch (err) {
        console.log(err);
      }
    });


    socket.on("editChat", async ({ senderId, receiverId, msgId , message }) =>{
      try {
        if (!msgId || !senderId || !receiverId || !message) {
          throw new Error("invalid credentials");
        }

        const roomId = getRoomId(senderId, receiverId);

        await chatModel.findByIdAndUpdate(msgId,{message});

        io.to(roomId).emit("editMsg", {msgId,message});
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("ai-message",async (messagePayload)=>{

      const [message,vectors] = await Promise.all([
        aiChatModel.create({
        user: messagePayload.user._id,
        content: messagePayload.content,
        role: "user",
      }),
       generateVector(messagePayload.content) ,
      ])

      
      await createMemory({
        vectors,
        messageId: message._id.toString(),
        metadata:{
          user: messagePayload.user._id,
          text: messagePayload.content
        }
      })
      
      const [memory,chatHistory] = await Promise.all([
        queryMemory({
        queryVector: vectors!,
        limit:3,
        metadata:{
          user: messagePayload.user._id
        }
      }),
      
      (await aiChatModel.find({
        user: messagePayload.user._id,
      }).sort({createdAt:-1}).limit(4).lean()).reverse()

      ])
      
    

      const stm = chatHistory.map(item => {
        return {
          role : item.role,
          parts : [{text : item.content}]
        }
      })

      const ltm = [
        {
          role: "user",
          parts: [{text:` these are some previous messages from the chats, use them to generate a response
              ${memory.map(item => item?.metadata?.text).join("\n")}  
            `}]
        }
      ]

       const response = await generateResponse([ ...ltm , ...stm]);

       socket.emit('ai-message',{
         content: response
        })
        
        const [responseMessage,responseVectors] = await Promise.all([
          aiChatModel.create({
             user: messagePayload.user._id,
             content: response,
             role: "model",
           })
           ,
           generateVector(response!),
        ]) 

          await createMemory({
           vectors : responseVectors!,
           messageId: responseMessage._id.toString(),
           metadata:{  
             user: messagePayload.user._id,
             text: response
           }
         })
        });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
};
