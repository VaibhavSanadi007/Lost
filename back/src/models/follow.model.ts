import mongoose, {Schema,Document,Types} from "mongoose";

export interface Ifollow extends Document{
  followingId: Types.ObjectId;
  followerId: Types.ObjectId;
  block:boolean;
}

const followSchema = new Schema({
  followingId:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  followerId:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  block:{
    type:Boolean,
    default: false,
  }
},{timestamps:true})

const followModel = mongoose.model<Ifollow>('follow',followSchema);
export default followModel;