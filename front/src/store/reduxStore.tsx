import { configureStore } from "@reduxjs/toolkit"
import userReducer from './userSlice.jsx'
import postReducer from './postSlice.jsx'
import chatReducer from './chatSlice.jsx';
import commentReducer from './commentSlice.tsx';
export const store = configureStore({
  reducer:{
    user : userReducer,
    post : postReducer,
    chat : chatReducer,
    comment : commentReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;