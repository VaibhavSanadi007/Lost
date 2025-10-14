import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { miniObj } from "./MessageList";
import { url } from "../App";
import defaultIcon from "../assets/default_profile_pic.jpg";
import { CreateSocketServer } from "../services/Socket";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import { VscSend } from "react-icons/vsc";
import { RiImageAiLine } from "react-icons/ri";
import {
  addChat,
  deleteChat,
  editChat,
  InitializeChat,
} from "../store/chatSlice";

export type menuType = {
  visible: boolean;
  x: number;
  y: number;
  msgId: string;
};

type msgObjType = {
  msgId: string;
  msg: string;
};

const MessageBox = () => {
  const { userId } = useParams();
  const UserData = useSelector((items: RootState) => items.user);

  const [menu, setmenu] = useState<menuType>({
    visible: false,
    x: 0,
    y: 0,
    msgId: UserData._id,
  });

  const [msgMetaData, setmsgMetaData] = useState<msgObjType>({
    msgId: "",
    msg: "",
  });

  const [msgEditFlag, setMsgEditFlag] = useState<boolean>(false);
  const [EditInput, setEditInput] = useState<string>("");

  const handleRightClick = (e: any, userId: string) => {
    e.preventDefault();
    let posX = e.pageX - 120;
    let posY = e.pageY;

    setmenu({
      visible: true,
      x: posX,
      y: posY,
      msgId: userId,
    });

    if (e.target.id !== msgMetaData.msgId) {
      setmsgMetaData({
        msgId: e.target.id,
        msg: e.target.innerHTML,
      });
    }
  };

  const handleMenuClose = () => {
    setmenu({
      visible: false,
      x: 0,
      y: 0,
      msgId: "",
    });
  };

  const [value, setvalue] = useState<miniObj>({
    _id: "bhaiHaiWrongIdHai",
    name: "",
    username: "",
    dp: "",
  });

  const getUserData = async () => {
    await axios
      .get(`${url}/user/${userId}`, { withCredentials: true })
      .then(({ data }) => {
        setvalue(data.data);
      });
  };

  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatData = useSelector((items: RootState) => items.chat);
  const [message, setmessage] = useState<string>("");
  const socketRef = useRef<any>(null);
  const myid = UserData._id;
  const friendid = userId;
  
  const MsgBoxref = useRef<any>(null);

  let prevChatArrLength = useRef<number>(chatData.length);

  const fetchChatData = async () => {
    const { data } = await axios.get(`${url}/msg/getchat/${userId}`, {
      withCredentials: true,
    });
    dispatch(InitializeChat(data));
  };


  useEffect(() => {
   if(chatData.length > prevChatArrLength.current){
      if(MsgBoxref.current){
        MsgBoxref.current.scrollTop = MsgBoxref.current.scrollHeight;
      }
   }
   prevChatArrLength.current = chatData.length;
  }, [chatData]);

  useEffect(() => {
    getUserData();
    fetchChatData();
  }, []);

  useEffect(() => {
    if (!myid || !friendid) {
      return;
    }
    if (!socketRef.current) {
      const socket = CreateSocketServer();
      socket.connect();
      socketRef.current = socket;

      socket.on("recieveMsg", (data) => {
        dispatch(addChat(data));
      });

      

      socket.on("deleteMsg",(msgId)=>{
        dispatch(deleteChat(msgId));
      })

      socket.on("editMsg",({msgId , message })=>{
         dispatch(
      editChat({
        id: msgId,
        message,
      })
    );
      })

    }


    socketRef.current.emit("join_room", {
      senderid: myid,
      recieverid: friendid,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [myid, friendid]);

  const handleMsg = () => {
    if (socketRef.current) {
      socketRef.current.emit("Chat", {
        senderId: myid,
        receiverId: friendid,
        message,
      });
    }
    setmessage("");
  };

  const handleMsgDelete = async () => {

    if(socketRef.current){

      socketRef.current.emit("deleteChat",{
        senderId: myid,
        receiverId: friendid,
      msgId : msgMetaData.msgId,
      })

    }

    handleMenuClose();
  };

  const handleMsgEdit = () => {
    setMsgEditFlag(true);
  };

  const handleSaveEditMsg = async () => {

     if(socketRef.current){

      socketRef.current.emit("editChat",{
        senderId: myid,
        receiverId: friendid,
        msgId : msgMetaData.msgId,
       message: EditInput,
      })

    }

    handleMenuClose()
    setMsgEditFlag(false);
  };

  return (
    <div className=" xl:w-[60%]   rounded-2xl overflow-hidden border border-gray-200 ">
      {/* menu modal */}
      {menu.visible && (
        <div
          style={{
            position: "absolute",
            top: menu.y,
            left: menu.x,
            zIndex: 100,
          }}
          className={`text-red-500 bg-gray-900  flex flex-col justify-center  xl:gap-2 cursor-pointer rounded xl:w-[120px] xl:h-[100px] `}
        >
          <h1
            className="hover:bg-gray-800 xl:py-1 rounded  text-center "
            onClick={() => handleMsgEdit()}
          >
            Edit
          </h1>
          <h1
            className="hover:bg-gray-800 xl:py-1 rounded text-center "
            onClick={() => handleMsgDelete()}
          >
            delete
          </h1>
        </div>
      )}

      {msgEditFlag && (
        <div className="z-101 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center backdrop-blur-sm  bg-black/50">
          <div className="bg-gray-200 xl:h-55 flex flex-col justify-between xl:w-100 rounded xl:p-2">
            <h1 className="text-center">Message Edit </h1>
            <textarea
              className="xl:h-30 w-full resize-none bg-gray-300 outline-none scrollbar-hide xl:p-2 rounded"
              onChange={(e) => setEditInput(e.target.value)}
              defaultValue={msgMetaData.msg}
            ></textarea>
            <div className="flex items-center justify-end xl:px-5 xl:gap-5">
              <button
                className="bg-red-400 text-white xl:w-15 xl:py-2 rounded active:scale-95"
                onClick={() => setMsgEditFlag(false)}
              >
                cancel
              </button>
              <button
                className="bg-sky-400 text-white xl:w-15 xl:py-2 rounded active:scale-95"
                onClick={() => handleSaveEditMsg()}
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-10 xl:h-20 sm:h-14  border-b  border-gray-200 flex items-center px-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={value.dp ? value.dp : defaultIcon}
            className="h-15 w-15  rounded-xl bg-gray-300 object-cover active:scale-95"
            onClick={() => navigate(`/viewuser/${userId}`)}
          />
          <div>
            <p className="text-2xl text-gray-900">{value.name}</p>
            <p className="text-[11px] text-gray-500 -mt-0.5">
              @{value.username}
            </p>
          </div>
        </div>
      </header>

      <main
        className="h-[calc(100vh-12rem)] sm:h-[calc(100vh-13rem)] overflow-y-auto px-1 py-4 sm:py-6"
        ref={MsgBoxref}
        onClick={() => handleMenuClose()}
      >
        {/* chat area */}

        <div className="mx-auto w-full xl:px-6 space-y-3 ">
          {chatData &&
            chatData.map((items, index) => (
              <div
                key={index}
                className={` xl:w-full  flex xl:gap-1 items-end ${
                  items.senderId === myid ? "justify-end" : "justify-start"
                }  `}
              >
                {items.senderId !== myid && <img src={value.dp ? value.dp : defaultIcon} className="h-6 w-6  xl:h-6 xl:w-6 object-cover rounded"/>}
                <h1
                  id={items._id}
                  onContextMenu={(e) =>
                    items.senderId === myid ? handleRightClick(e,myid) : ""
                  }
                  className={`${
                    items.senderId === myid ? "border border-gray-200 text-black" : "bg-black text-white"
                  }  xl:px-1  xl:py-0.5 xl:w-fit max-w-50  xl:max-w-70   rounded  break-words   `}
                >
                  {items.message}
                </h1>
                 {items.senderId === myid && <img src={UserData.dp? UserData.dp : defaultIcon} className="h-6 w-6  xl:h-6 xl:w-6 object-cover rounded"/>}
              </div>
            ))}
        </div>
      </main>

      <footer className="sticky  bottom-6  border-t border-gray-200">
        <div className="mx-auto xl:h-20   max-w-3xl px-3  py-3 ">
          <div className="flex items-center gap-1 sm:gap-3  border  border-gray-200 rounded-full pl-3 pr-2 sm:pr-2.5 py-1.5 shadow-sm ">
            <textarea
              onChange={(e) => setmessage(e.target.value)}
              value={message}
              placeholder="Type a message..."
              className="flex-1 items-center xl:py-2 xl:px-2 xl:h-10 scrollbar-hide  min-w-0 resize-none  outline-none text-sm "
            />

            <label
            htmlFor="sendMsg"
              className="h-9 w-9 rounded-full inline-flex items-center justify-center hover:bg-gray-50"
              aria-label="Attach"
            >
              <RiImageAiLine size={25} className="active:scale-95" />
              <input type="file" name="sendMsg" id="sendMsg" className="hidden" />
            </label>

            <button
              className="px-2"
              onClick={()=>{
                handleMsg();
              }}
            >
              <VscSend className="text-black active:scale-95"  size={25} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default MessageBox;
