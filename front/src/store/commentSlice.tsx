import { createSlice } from "@reduxjs/toolkit";
import type { ObjType as userType } from "./userSlice";

export interface ObjType {
  _id: string;
  commentUserId: userType;
  postId: string;
  commentText: string;
  updatedAt:string;
}

const initialState: ObjType[] = [];
const commentSlice = createSlice({
  name: "commentSlice",
  initialState,
  reducers: {
    InitializeComment: (_state, action) => {
       return  action.payload;
    },
    addComment: (state, action) => {
      state.push(action.payload);
    },
    deleteComment: (state,action) => {
     return state.filter((item)=>{
        return item._id !== action.payload;
      })
    },
    editComment: (state,action) => {
      const comment = state.find((item)=> item._id === action.payload._id);
        if(comment){
          comment.commentText = action.payload.commentText;
        }
    }
  },
});

export const { InitializeComment , addComment , deleteComment , editComment } = commentSlice.actions;
export default commentSlice.reducer;
