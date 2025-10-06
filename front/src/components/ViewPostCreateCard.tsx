import { BiLike, BiSolidLike } from "react-icons/bi"
import { LiaCommentSolid } from "react-icons/lia"
import { RiShareForwardLine } from "react-icons/ri"
import { VscSend } from "react-icons/vsc"
import { useSelector } from "react-redux"
import type { RootState } from "../store/reduxStore"

import defaultIcon from '../assets/default_profile_pic.jpg';
import { useState } from "react"
const ViewPostCreateCard = () => {
  const [likeflag,setlikeflag] = useState(false);

  const userData = useSelector((items:RootState)=>items.user);

  return (
    <div className="xl:w-[40%] xl:h-10 ">
      <article className="  border border-gray-200 rounded-2xl  xl:w-140  overflow-hidden ">
            {/* Header */}
            <div className="xl:h-17 xl:px-8 flex items-center gap-3">
              <div className="h-13 w-13 rounded-2xl overflow-hidden   active:scale-95 cursor-pointer">
                <img src={userData.dp} className="h-full w-full object-cover  " />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center gap-x-2">
                 <div>
                   <h1 className="font-semibold cursor-pointer active:scale-95"  >{userData.name}</h1>
                  <h3 className="text-sm text-gray-500">@{userData.username}</h3>
                 </div>
                  <span className="text-xs text-gray-500">Now</span>
                </div>
               
              </div>
            </div>
      
            {/* Big image (Unsplash) */}
            <div className="xl:w-full xl:px-5  xl:py-2 flex flex-col xl:gap-2 justify-center border-y border-gray-200 ">
      
             <p className="text-sm  ">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae, magni.
                  <br />
                #jai #jawan #jai #kisan
                </p>
      
              <img
                className="  h-full  object-contain xl:h-80 "
                src={defaultIcon}
                alt="Team working in an office from Unsplash"
              />
      
      
             <div className="w-full xl:px-5 xl:h-7 flex items-end justify-between ">
      
              <div className="flex items-center justify-center xl:gap-1">
                {likeflag? <BiSolidLike size={20} className={`active:scale-95 `} onClick={()=>setlikeflag(false)} /> : <BiLike size={20} className={`active:scale-95 `} onClick={()=>setlikeflag(true)} />}
              
              <h1>Likes</h1>
              </div>
      
              <div className="flex items-center justify-center xl:gap-1">
              <LiaCommentSolid  size={20} className="active:scale-95 "/>
              <h1>Comments</h1>
              </div>
      
              <div className="flex items-center justify-center xl:gap-1">
              <RiShareForwardLine  size={20} className="active:scale-95 "/>
              <h1>Share</h1>
              </div>
      
             </div>
      
            </div>
      
            {/* Actions */}
            <div className="xl:h-15 xl:w-full xl:px-10 flex items-center justify-between ">
              <input className="xl:w-90 xl:h-10 rounded-2xl border border-gray-200 xl:px-3 outline-none " type="text" placeholder="Write your comment.." />
              <VscSend size={25} className="cursor-pointer active:scale-95" />
            </div>
          </article>
    </div>
  )
}
export default ViewPostCreateCard