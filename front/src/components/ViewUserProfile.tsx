import Sidebar from "./Sidebar"
import UserProfile from "./UserProfile"
import UserProfilePosts from "./UserProfilePosts"

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../App";
import type { ObjType } from "../store/postSlice";
// import ViewFollowers from "./ViewFollowers";
// import type { ObjType as UserType } from "../store/userSlice";
const ViewUserProfile = () => {

    const [value, setvalue] = useState<ObjType[]>([]);
  const { userId } = useParams();
  // const [followData,setfollowData] = useState<UserType[]>([]);
  // const [openFollowers, setopenFollowers] = useState<boolean>(false);

  const handleGetPosts = async () => {
    const { data } = await axios.get(`${url}/post/userposts/${userId}`, {
      withCredentials: true,
    });

    setvalue([...data.data]);
  };
  

  //   const handleGetFollower = async () => {
  //   const FollowData = await axios.get(
  //     `${url}/user/${userId}/followers`,
  //     { withCredentials: true }
  //   );
  //   setfollowData(FollowData.data.data);
  // };

  useEffect(() => {
    // handleGetFollower();
    handleGetPosts();
  }, []);

  return (
    <div className="w-full h-full xl:pl-70 xl:py-5  ">
      <Sidebar/>
      <UserProfile value={value} />
      <UserProfilePosts value={value}/>
      {/* {openFollowers && <ViewFollowers setopenFollowers={setopenFollowers} followData={followData} /> } */}
    </div>
  )
}
export default ViewUserProfile