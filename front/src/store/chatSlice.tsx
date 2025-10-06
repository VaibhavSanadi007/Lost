import { createSlice } from "@reduxjs/toolkit";

export interface ObjType {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
}

const initialState: ObjType[] = [];
const chatSlice = createSlice({
  name: "chatSlice",
  initialState,
  reducers: {
    InitializeChat: (_state, action) => {
       return  action.payload;
    },
    addChat: (state, action) => {
      state.push(action.payload);
    },
    deleteChat: (state,action) => {
     return state.filter((item)=>{
        return item._id !== action.payload;
      })
    },
    editChat: (state,action) => {
      const msg = state.find((item)=> item._id === action.payload.id);
        if(msg){
          msg.message = action.payload.message;
        }
    }
  },
});

export const { InitializeChat , addChat , deleteChat , editChat } = chatSlice.actions;
export default chatSlice.reducer;
