import type { Dispatch, FC, SetStateAction } from "react";
import type { FollowType } from "../store/userSlice";

import defaulticon from '../assets/default_profile_pic.jpg';

type property = {
  setopenFollowers : Dispatch<SetStateAction<boolean>>;
  followData : FollowType[];
}

const ViewFollowers:FC<property> = ({setopenFollowers , followData}) => {
    console.log("followData",followData);
  return (
    <div className="fixed  inset-0 z-50 flex  justify-center xl:pt-30" >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/85"
        aria-hidden="true"
        onClick={()=>setopenFollowers(false)}
      />
      <div className="relative xl:w-[30%] h-fit xl:py-3 xl:px-3 bg-white rounded-2xl shadow-xl  overflow-y-sc">
        {/* Header */}
        <div className="px-5 sm:px-6 py-2   xl:mb-1">
          <h2 className="text-2xl font-semibold text-center">Followers</h2>
        </div>
        <div className="overflow-y-scroll scrollbar-hide h-90">
        {
          followData && followData.map((items,index)=>(
            <div key={index} className=" flex items-center xl:my-1 justify-between xl:py-1.5 xl:px-3  duration-150 hover:bg-white/10 rounded-2xl   " >
        <div className="flex xl:gap-3 " >
        <img src={items.followingId.dp ? items.followingId.dp : defaulticon} className="h-15 w-15 rounded-2xl object-cover cursor-pointer active:scale-95" />

        <div className="flex flex-col justify-center">
          <h1 className="uppercase font-semibold text-gray-800 cursor-pointer active:scale-95">{items.followingId.name}</h1>
          <h1 className="text-gray-400">@{items.followingId.username}</h1>
        </div>
        </div>

              
       </div>
                                    
          ))
        }
        </div>
     </div>
    </div>
  )
}
export default ViewFollowers