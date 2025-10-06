import axios from "axios";
import { url } from "../App";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {  type ObjType } from "../store/userSlice";
import defaultImg from "../assets/default_profile_pic.jpg";


const UserProfile = () => {
  const { userId } = useParams();
 

  const [value, setvalue] = useState<ObjType>({
    _id: "",
    username: "",
    name: "",
    email: "",
    dp: "",
    password: "",
    url: "",
    description: "",
    tags: [],
    followers: [],
    following: [],
  });

  const handleGetUsersData = async () => {
    const { data } = await axios.get(`${url}/user/${userId}`, {
      withCredentials: true,
    });
    setvalue(data.data);
  };

  const handleFollowUser = async () => {
    await axios.post(`${url}/user/${userId}/follow`,{},{withCredentials:true});
   
  }
  const handleUnFollowUser = async () => {
   await axios.delete(`${url}/user/${userId}/unfollow`,{withCredentials:true});
  }

  useEffect(() => {
    handleGetUsersData();
  }, []);

  return (
    <div className="text-white w-full  flex items-center justify-center">
      <section className="bg-gray-100 border-gray-200 rounded-xl overflow-hidden xl:h-fit xl:w-[60%]">
        <div className="px-6 pt-4 pb-6   ">
          <div className="flex items-center justify-center xl:gap-5 ">
            <img
              src={value.dp ? value.dp : defaultImg}
              className=" xl:h-40 xl:w-40 object-cover rounded-2xl sm:h-24 sm:w-24  "
            />
            <div className="flex flex-col ">
              <div className="">
                <div className="flex items-center  gap-2 ">
                  <h1 className="text-lg sm:text-xl xl:text-2xl text-gray-700 font-semibold">
                    {value.username}
                  </h1>
                  {/* Verified tick as small pill */}
                  <span className="inline-flex h-5 w-5 rounded-full bg-indigo-600 text-white items-center justify-center text-[10px]">
                    ✓
                  </span>
                </div>

                <p className="text-sm text-gray-500 ">{value.name}</p>
              </div>

              <p className="mt-3 xl:h-15  text-sm text-gray-700 ">
                {value.description}
              </p>

              <p className="mt-3 text-sm  text-blue-800 ">{value.tags}</p>

              {/* Edit button */}
            </div>
          </div>
          {/* Name row */}

          <div className="mt-4 xl:mx-35  border-t border-gray-200 " />

          <div className="mt-4 flex  justify-center items-center gap-10 text-sm">
            <p className="flex flex-col hover:border-b hover:border-gray-300 cursor-pointer xl:p-1">
              <span className="text-2xl text-gray-700 font-bold text-center">
                2
              </span>{" "}
              <span className="text-gray-400"> Posts </span>
            </p>
            <p className="flex flex-col hover:border-b hover:border-gray-300 cursor-pointer xl:p-1">
              <span className="text-2xl text-gray-700 font-bold text-center">
              0
              </span>{" "}
              <span className="text-gray-400"> Followers </span>
            </p>
            <p className="flex flex-col hover:border-b hover:border-gray-300 cursor-pointer xl:p-1">
              <span className="text-2xl text-gray-700 font-bold text-center">
               0
              </span>{" "}
              <span className="text-gray-400"> Following </span>
            </p>
          </div>

          <div className="mt-4 my-2 xl:mx-35  border-t border-gray-200 " />

          <div className="flex items-center justify-center xl:gap-10 ">
            <button className="rounded-xl xl:w-25 xl:py-1.5 bg-black cursor-pointer active:scale-95 " onClick={()=>handleFollowUser()}>
              Follow
            </button>
            <button className="rounded-xl xl:w-25 xl:py-1.5 bg-red-400 cursor-pointer active:scale-95"       
            onClick={()=>{
              handleUnFollowUser()
              }} >
              UnFollow
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default UserProfile;
