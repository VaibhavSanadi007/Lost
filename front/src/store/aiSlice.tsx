import { createSlice} from "@reduxjs/toolkit";

export interface ChatMessage {
  _id: string;
  user: string;
  content: string;
  role: "user" | "model";
  createdAt: string;
  updatedAt: string;
  __v: number;
}


const initialState: ChatMessage[] = [];

const chatSlice = createSlice({
  name: "aichat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      return action.payload;
    },
    addMessage: (state, action) => {
      state.push(action.payload);
    },
    clearMessages: (state) => {
      state = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
