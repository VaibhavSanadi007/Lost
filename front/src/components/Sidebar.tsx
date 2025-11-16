import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/reduxStore";

import axios from "axios";
import defaultImg from "../assets/default_profile_pic.jpg";


import { DiMysql } from "react-icons/di";
import { GrHomeRounded } from "react-icons/gr";
import { FiCompass , FiMessageCircle } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import {  MdLogout } from "react-icons/md";
import { PiImage } from "react-icons/pi";
// import { AiOutlineRobot } from "react-icons/ai";

import { url } from "../App";

const Sidebar = () => {
  const userData = useSelector((item: RootState) => item.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const data = await axios.get(`${url}/auth/logout`, {
      withCredentials: true,
    });
    navigate(`/`);
    console.log(data);
  };


  return (
    <aside className="md:w-65 lg:w-60 xl:w-70 fixed left-0 xl:left-15 top-0  lg:px-3.5 md:pl-10 hidden lg:block">
      <div className="flex flex-col w-full h-screen top-0">
        {/* Brand */}
        <div className="w-full md:h-25 lg:h-25 xl:h-30 flex items-center  ">
          <h1 className="text-3xl font-semibold xl:ml-5 flex items-center " onClick={()=>{
            location.reload();
          }}>
            <DiMysql />
            LOST
          </h1>
        </div>

        {/* Nav */}
        <nav className="bg-black backdrop-blur-2xl text-white rounded-xl overflow-hidden xl:pb-2 xl:pt-2 md:py-2 lg:py-4 xl:px-1  md:px-2 cursor-pointer flex flex-col lg:gap-4 xl:gap-4 md:gap-2">
          <div className="flex items-center xl:px-2 xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=> navigate(`/home`)}>
          <GrHomeRounded size={20} />
          <h1 className="">Feed</h1>
          </div>
          <div className="flex items-center xl:px-2  xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=>navigate(`/messagelist/${userData._id}`)}>
          <FiMessageCircle size={20} />
          <h1 className="">Friends</h1>
          </div>
          <div className="flex items-center xl:px-2  xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=>navigate(`/explore`)}>
          <FiCompass size={20}/>
          <h1 className="">Explore</h1>
          </div>
          {/* <div className="flex items-center xl:px-2  xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=>navigate(`/ai`)}>
          <AiOutlineRobot size={20} />
          <h1 className="">chat AI</h1>
          </div> */}
          <div className="flex items-center xl:px-2  xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=>navigate(`/profile/${userData._id}`)}>
          <CgProfile size={20} />
          <h1 className="">Profile</h1>
          </div>
          <div className="flex items-center xl:px-2  xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=>navigate(`/setting`)}>
          <IoSettingsOutline size={20} />
          <h1 className="">Settings</h1>
          </div>
          <div className="flex items-center xl:px-2  xl:py-1.5 lg:gap-2 xl:gap-2 rounded-xl hover:bg-white/10" onClick={()=>navigate(`/createpost`)}>
          <PiImage size={20} />
          <h1 className="">Create post</h1>
          </div>
        </nav>

        {/* Create Post button */}
        <div className="w-full xl:h-45 md:h-40 md:pb-8 flex items-end xl:pb-8 justify-center">
          {/* <button
            className="xl:w-full rounded-2xl md:h-10 md:px-5 md:w-full xl:h-10 bg-black  text-white  font-medium xl:px-5  flex items-center justify-between"
          >
           Go pro <CiStar className="text-yellow-500" size={20} />
          </button> */}
        </div>

        {/* Mini profile bottom-left */}
        <div className="border-t border-gray-200 xl:px-3.5 xl:pt-3 md:pt-3">
          <div className="flex items-center justify-between">
            <div
              className=" flex items-center gap-3"
              onClick={() => navigate(`/profile/${userData._id}`)}
            >
              <img
                src={userData.dp ? userData.dp : defaultImg}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <p className="text-xl font-medium">
                  {userData.name ? userData.name : "xyz"}
                </p>
                <p className="text-sm text-gray-400">@{userData.username}</p>
              </div>
            </div>

           
             <MdLogout size={25} onClick={handleLogout} className="cursor-pointer" />

          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
