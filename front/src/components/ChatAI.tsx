import { useEffect, useRef, useState } from "react";
import defaultIcon from "../assets/default_profile_pic.jpg";
import { CreateSocketServer } from "../services/Socket";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import { VscSend } from "react-icons/vsc";

import Sidebar from "./Sidebar";
import { addMessage, setMessages } from "../store/aiSlice";
import { AiOutlineRobot } from "react-icons/ai";
import axios from "axios";
import { url } from "../App";

const ChatAI = () => {
  const UserData = useSelector((items: RootState) => items.user);
  const dispatch = useDispatch();

  const chatData = useSelector((items: RootState) => items.aichat);
  const [message, setmessage] = useState<string>("");
  const socketRef = useRef<any>(null);
  const myid = UserData._id;

  const MsgBoxref = useRef<any>(null);

  let prevChatArrLength = useRef<number>(chatData.length);

  useEffect(() => {
    if (chatData.length > prevChatArrLength.current) {
      if (MsgBoxref.current) {
        MsgBoxref.current.scrollTop = MsgBoxref.current.scrollHeight;
      }
    }
    prevChatArrLength.current = chatData.length;
  }, [chatData]);

  useEffect(() => {
    if (!myid) {
      return;
    }
    const socket = CreateSocketServer();
    socket.connect();
    socketRef.current = socket;

    socket.on("ai-message", (data) => {
      console.log(data);
      dispatch(
        addMessage({
          user: myid,
          content: data.content,
          role: "model",
        })
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [myid]);

  const handleMsg = () => {
    if (socketRef.current) {
      socketRef.current.emit("ai-message", {
        user: {
          _id: myid,
        },
        content: message,
      });

      dispatch(
        addMessage({
          user: myid,
          content: message,
          role: "user",
        })
      );
    }
    setmessage("");
  };

   async function aichat(): Promise <void> {
      const data = await axios.get(`${url}/msg/aichat`,{withCredentials:true});
      dispatch(setMessages(data.data.data));
  }

  useEffect(()=>{
    aichat();
  },[]);

  return (
    <div className="w-full h-screen  flex items-center justify-center ">
      <Sidebar />

      <div className=" lg:w-[40%]  xl:w-[40%]   bg-amber-5 rounded-2xl overflow-hidden border border-gray-200 ">
        <header className="sticky top-0 z-10 lg:h-20 xl:h-20 sm:h-14  border-b  border-gray-200 flex items-center px-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-2xl text-gray-900">Chat AI ✨</p>
              <p className="text-[11px] text-gray-500 -mt-0.5">
                friendly chat with artificial intelligence
              </p>
            </div>
          </div>
        </header>

        <main
          className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-13rem)] overflow-y-auto px-1 py-4 sm:py-6"
          ref={MsgBoxref}
        >
          {/* chat area */}

          <div className="mx-auto w-full xl:px-6 space-y-3 ">
            {chatData &&
              chatData.map((items, index) => (
                <div
                  key={index}
                  className={` xl:w-full  flex xl:gap-1 items-end ${
                    items.role === "user" ? "justify-end" : "justify-start"
                  }  `}
                >
                  {items.role == "model" && <AiOutlineRobot size={20} />}
                  <h1
                    id={items._id}
                    className={`${
                      items.role === "model"
                        ? "border border-gray-200 text-black"
                        : "bg-black text-white"
                    }  xl:px-1  xl:py-0.5 xl:w-fit max-w-50  xl:max-w-70   rounded  break-words   `}
                  >
                    {items.content}
                  </h1>
                  {items.role === "user" && (
                    <img
                      src={UserData.dp ? UserData.dp : defaultIcon}
                      className="h-6 w-6  xl:h-6 xl:w-6 object-cover rounded"
                    />
                  )}
                </div>
              ))}
          </div>
        </main>

        <footer className="sticky  bottom-6  border-t bg-white border-gray-200">
          <div className="mx-auto lg:h-20 xl:h-20  max-w-3xl px-3  py-3 ">
            <div className="flex items-center gap-1 sm:gap-3  border  border-gray-200 rounded-full pl-3 pr-2 sm:pr-2.5 py-1.5 shadow-sm ">
              <textarea
                onChange={(e) => setmessage(e.target.value)}
                value={message}
                placeholder="Type a message..."
                className="flex-1 items-center lg:h-10 lg:py-2  xl:px-2  scrollbar-hide  min-w-0 resize-none  outline-none text-sm "
              />

              <button
                className="px-2"
                onClick={() => {
                  handleMsg();
                }}
              >
                <VscSend className="text-black active:scale-95" size={25} />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatAI;
