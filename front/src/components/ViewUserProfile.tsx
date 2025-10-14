import Sidebar from "./Sidebar"
import UserProfile from "./UserProfile"
import UserProfilePosts from "./UserProfilePosts"

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../App";
import type { ObjType } from "../store/postSlice";

import ViewFollowers from "./ViewFollowers";
import type { FollowType } from "../store/userSlice";
import ViewFollowing from "./ViewFollowing";
const ViewUserProfile = () => {

    const [value, setvalue] = useState<ObjType[]>([]);
  const { userId } = useParams();

  const [followData,setfollowData] = useState<FollowType[]>([]);
  const [followingData,setfollowingData] = useState<FollowType[]>([]);
  const [openFollowers, setopenFollowers] = useState<boolean>(false);
  const [openFollowing, setopenFollowing] = useState<boolean>(false);

  const handleGetPosts = async () => {
    const { data } = await axios.get(`${url}/post/userposts/${userId}`, {
      withCredentials: true,
    });

    setvalue([...data.data]);
  };
  

    const handleGetFollowing = async () => {
    const FollowData = await axios.get(
      `${url}/user/${userId}/following`,
      { withCredentials: true }
    );
    setfollowingData(FollowData.data.data);
  };
    const handleGetFollower = async () => {
    const FollowData = await axios.get(
      `${url}/user/${userId}/followers`,
      { withCredentials: true }
    );
    setfollowData(FollowData.data.data);
  };

  useEffect(() => {
    handleGetPosts();
    handleGetFollower();
    handleGetFollowing();
  }, []);

  return (
    <div className="w-full h-full xl:pl-70 xl:py-5  ">
      <Sidebar/>
      <UserProfile value={value} setopenFollowers={setopenFollowers} setopenFollowing={setopenFollowing} />
      <UserProfilePosts value={value}/>
      {openFollowers && <ViewFollowers setopenFollowers={setopenFollowers} followData={followData} /> }
      {openFollowing && <ViewFollowing setopenFollowing={setopenFollowing} followingData={followingData} /> }
    </div>
  )
}
export default ViewUserProfile