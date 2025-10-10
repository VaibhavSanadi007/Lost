import { Server } from "socket.io";
import chatModel from "../models/socket.model.js";

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
    })

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
};
