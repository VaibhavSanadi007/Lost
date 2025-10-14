import { createSlice } from "@reduxjs/toolkit";

export interface FollowArrayType {
  _id: string;
  username: string;
  name: string;
  dp: string;
}

export interface FollowType {
  _id:string;
  followingId: FollowArrayType;
  followerId: FollowArrayType;
  block: boolean;
}

export interface ObjType {
  _id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  dp: string;
  url: string;
  description: string;
  tags: string[];
  followers: FollowType[];
  following: FollowType[];
  privateMode: boolean;
}

const initialState: ObjType = {
  _id: "",
  username: "",
  name: "",
  email: "",
  dp: "",
  password: "",
  url: "",
  description: "",
  tags: [],
  followers: [],
  following: [],
  privateMode: false,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    addUser: (_state, action) => {
      return action.payload;
    },
    addFollower: (state,action) => {
      state.followers = action.payload;
    },
    addFollowing: (state,action) => {
      state.following = action.payload;
    },
    unfollowuser: (state,action) => {
      state.following = state.following.filter((items)=>{
       return items._id !== action.payload;
      })
    }
  },
});

export const { addUser , addFollower , addFollowing , unfollowuser } = userSlice.actions;
export default userSlice.reducer;
