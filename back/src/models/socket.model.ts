import { Schema, model, Document, Types } from "mongoose";

export interface IChat extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message: string;  
  participants: Types.ObjectId[];
}

const chatSchema = new Schema<IChat>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    participants: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  { timestamps: true }
);

chatSchema.index({participants: 1});
chatSchema.index({participants: 1, updatedAt: -1});

const chatModel = model<IChat>("chat", chatSchema);

export default chatModel;


