import { createSlice } from "@reduxjs/toolkit";

type obj = {
  _id: string;
  name: string;
  username: string;
  dp?: string;
};

export interface ObjType {
  _id: string;
  name: string;
  username: string;
  postUserId: obj;
  postUrl: string;
  postTags?: string[];
  like: string[];
  postDescription?: string;
  postType: string;
  createdAt: string;
  updatedAt: string;
}

const initialState: ObjType[] = [];
const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {
    addPost: (_state,action) => {
        return  action.payload;
    },
    deletePost: (state, action) => {
      return state.filter((item) => {
        console.log(item._id !== action.payload,item._id,"_",action.payload);
        return item._id.toString() !== action.payload.toString();
      });
    },
    editPost: (state, action) => {
      const post = state.find((item) => item._id === action.payload.postId);
      if (post && action.payload.description) {
        post.postDescription = action.payload.description;
      }
      if (post && action.payload.tags) {
        post.postTags = action.payload.tags;
      }
    },
    addLike: (state, action) => {
      const post = state.find((item) => item._id === action.payload._id);
      if (post) {
        post.like.push(action.payload.userId);
      }
      console.log(state);
    },
    removeLike: (state, action) => {
      const post = state.find((item) => item._id === action.payload._id);

      if (post) {
        post.like = post.like.filter((item) => item !== action.payload.userId);
      }
    },
  },
});

export const { addPost, addLike, removeLike, deletePost, editPost } =
  postSlice.actions;
export default postSlice.reducer;
