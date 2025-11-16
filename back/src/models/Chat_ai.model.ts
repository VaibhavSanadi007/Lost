import mongoose, { Types } from "mongoose";

export interface Icomment extends Document{
  user: Types.ObjectId,
  content: string,
  role?: string,
}

const messageSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user",
  },
  content:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    enum:["user","model","system"],
    default:"user"
  }
},{
  timestamps:true,
})

const aiChatModel = mongoose.model('chatai',messageSchema);
export default aiChatModel;

