import { io } from "socket.io-client";
import { url } from "../App";

export const CreateSocketServer =  () => {
  const newSocket =  io(url, {
    autoConnect: false,
    withCredentials:true,
  });
  return newSocket;
}