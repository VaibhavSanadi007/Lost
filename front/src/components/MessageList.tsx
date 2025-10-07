import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "./Sidebar"
import axios from "axios";
import { useEffect, useState } from "react";

import { url } from "../App";

export type miniObj = {
  _id:string;
  name:string;
  username:string;
  dp?:string;
  description?:string;
}

type objType = {
followerId: miniObj;
}

const MessageList = () => {
const navigate = useNavigate();
const {userId} = useParams();
const [value,setvalue] = useState<objType[]>([]);

const handleMsgList = async ()=>{
  
  await axios.get(`${url}/user/${userId}/following`,{withCredentials:true}).then(({data})=>{
    setvalue(data.data);
  })

}

useEffect(()=>{
  handleMsgList();
},[]);

  return (
    <div className="h-full w-full flex pt-5 xl:pt-10 justify-center md:pl-70 lg:pl-0 ">
      <Sidebar/>
      <div className="xl:w-130 px-2 xl:px-0">
        <h1 className="text-gray-500 text-3xl xl:text-4xl xl:mb-5 mb-3">Messages</h1>
        <div className="xl:w-full">

      {
        value ? value?.map((item,index)=>
        <div key={index} className="xl:h-fit xl:py-3 py-2 w-full border border-gray-200 rounded-2xl xl:mb-2 mb-2 flex items-center xl:gap-4 gap-3 xl:px-3 px-3" onClick={()=>{
          navigate('/messagebox/'+item.followerId._id);
        }}>
          <img src={item.followerId.dp}  className="w-15 h-15 rounded-2xl object-cover" />
          <div>
            <h1 className=" text-xl">{item.followerId.name}</h1>
          <h1 className="text-sm text-gray-400 xl:mb-3">@{item.followerId.username}</h1>
          <h1 className="text-sm ">{item.followerId.description}</h1>
          </div>
        </div>
        ) : <h1>No Messages</h1>

      }
        </div>
      </div>
    </div>
  )
}
export default MessageList
