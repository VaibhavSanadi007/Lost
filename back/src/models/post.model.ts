import { Schema , Document, model , Types} from "mongoose";

export interface Ipost extends Document{
  postUserId: Types.ObjectId,
  postId: string,
  postUrl: string,
  postDescription?: string,
  postTags?: string[],
  like: any,
  postType:string,
}

const postSchema = new Schema({
postUserId:{
  type: Schema.Types.ObjectId,
  ref: 'User',
  required:true,
},
postId:{
  type: String,
  required:true,
},
postUrl:{
  type: String,
  required: true,
},
postDescription:{
  type: String,
},
postTags:{
  type:[String],
},
like:{
  type:[{type: Schema.Types.ObjectId , ref:'User'}]
},
postType:{
  type: String,
}
},{
  timestamps:true
});

const postModel = model<Ipost>('post',postSchema);

export default postModel;