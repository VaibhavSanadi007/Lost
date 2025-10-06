import { useEffect, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ProfileHeader from "./ProfileHeader";
import Sidebar from "./Sidebar";
import UserPosts from "./UserPosts";
import axios from "axios";
import { url } from "../App";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import { addFollower, addFollowing } from "../store/userSlice";
import Followers from "./Followers";
import Following from "./Following";

const Profile = () => {
  const UserData = useSelector((item: RootState) => item.user);
  const dispatch = useDispatch();
  const [open, setopen] = useState<boolean>(false);
  const [openFollowers, setopenFollowers] = useState<boolean>(false);
  const [openFollowing, setopenFollowing] = useState<boolean>(false);

  const handleGetFollower = async () => {
    const FollowData = await axios.get(
      `${url}/user/${UserData._id}/followers`,
      { withCredentials: true }
    );
    dispatch(addFollower(FollowData.data.data));
  };

  const handleGetFollowing = async () => {
    const FollowData = await axios.get(
      `${url}/user/${UserData._id}/following`,
      { withCredentials: true }
    );
    dispatch(addFollowing(FollowData.data.data));
  };

  useEffect(() => {
    handleGetFollower();
    handleGetFollowing();
  }, []);

  return (
    <div className="h-full w-full ">
      <Sidebar />
      <div className="md:ml-50 xl:ml-70 flex flex-col  items-center xl:gap-5 py-5 xl:py-5 ">
        <ProfileHeader setopen={setopen} setopenFollowers={setopenFollowers} setopenFollowing={setopenFollowing}  />
      </div>
      {open && <EditProfileModal setopen={setopen} />}
      {openFollowers && <Followers setopenFollowers={setopenFollowers}/>}
      {openFollowing && <Following setopenFollowing={setopenFollowing} />}
      <UserPosts />
    </div>
  );
};
export default Profile;
