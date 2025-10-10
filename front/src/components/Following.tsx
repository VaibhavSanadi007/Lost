import type { FC } from "react"
import { useSelector , useDispatch } from "react-redux";
import type { RootState } from "../store/reduxStore";
import defaultIcon from '../assets/default_profile_pic.jpg';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../App";
import { unfollowuser } from "../store/userSlice";

type property = {
setopenFollowing : React.Dispatch<React.SetStateAction<boolean>>;
}

const Following:FC<property> = ({setopenFollowing}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const followData = useSelector((item:RootState)=>item.user.following);

   const handleUnFollowUser = async (userId:string) => {
   await axios.delete(`${url}/user/${userId}/unfollow`,{withCredentials:true});
  }


  return (
      <div className="fixed  inset-0 z-50 flex  justify-center xl:pt-30" >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/85"
        aria-hidden="true"
        onClick={()=>setopenFollowing(false)}
      />
      <div className="relative xl:w-[30%] h-fit xl:py-3 xl:px-3 bg-white rounded-2xl shadow-xl  overflow-y-sc">
        {/* Header */}
        <div className="px-5 sm:px-6 py-2  xl:mb-1">
          <h2 className="text-2xl font-semibold text-center">Following</h2>
        </div>
        <div className="overflow-y-scroll scrollbar-hide h-90">
        {
          followData && followData.map((items,index)=>(
            <div key={index} className=" flex items-center xl:my-1 justify-between xl:py-1.5 xl:px-3  duration-150 hover:bg-white/10 rounded-2xl   " >
        <div className="flex xl:gap-3 " onClick={()=>navigate(`/viewuser/${items.followerId._id}`)}>
        <img src={items.followerId.dp ? items.followerId.dp : defaultIcon} className="h-15 w-15 rounded-2xl object-cover cursor-pointer active:scale-95" />

        <div className="flex flex-col justify-center">
          <h1 className="uppercase font-semibold text-gray-800 cursor-pointer active:scale-95">{items.followerId.name}</h1>
          <h1 className="text-gray-400">@{items.followerId.username}</h1>
        </div>
        </div>

        <h1 className="cursor-pointer active:scale-95 xl:px-1.5 xl:py-1.5 rounded border bg-black  text-gray-200" onClick={()=>{
          handleUnFollowUser(items.followerId._id);
         dispatch(unfollowuser(items._id));
          }}>unfollow</h1>
       </div>
                                    
          ))
        }
        </div>


   
      </div>
    </div>
  )
}
export default Following