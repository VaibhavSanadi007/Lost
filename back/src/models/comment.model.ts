import { Schema , Document, model , Types} from "mongoose";

export interface Icomment extends Document{
  postId: Types.ObjectId,
  commentUserId: Types.ObjectId,
  commentText: string,
}

const commentSchema = new Schema({
commentUserId:{
  type: Schema.Types.ObjectId,
  ref: 'User',
  required:true,
},
postId:{
  type: Schema.Types.ObjectId,
  ref: 'post',
  required:true,
},
commentText:{
  type: String,
  required: true,
}
},{
  timestamps:true
});

const commentModel = model<Icomment>('comment',commentSchema);

export default commentModel;