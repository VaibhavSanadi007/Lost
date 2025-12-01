import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import RightTrail from "./RightTrail";
import Sidebar from "./Sidebar";
import StoryRow from "./StoryRow";
import type { RootState } from "../store/reduxStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { addPost } from "../store/postSlice";
import CommentsSection from "./CommentsSection";
import LikesSection from "./LikesSection";
import { url } from "../App";
import StoryModal from "./StoryModal";
import getUserData from "../custom_component/GetUserData";

const Home = () => {
  
  const [storyModalFlag,setStoryModalFlag] = useState<boolean>(false);
  
  const [flag, setflag] = useState<string>("");
  const [postId, setPostId] = useState<string>("");
  
  const dispatch = useDispatch();
  const userFeed = useSelector((item: RootState) => item.post);
  
 const getFeed = async () => {
    const { data } = await axios.get(`${url}/post/feed`, {
      withCredentials: true,
    });
    dispatch(addPost(data.data));
  };
  
  getUserData();
  useEffect(() => {
    getFeed();
  }, []);
  
  
  return (
    <div className="h-full w-full  flex justify-evenly xl:gap-5  ">
      <Sidebar/>
      <div className="h-fit w-full px-1 lg:w-[50%] xl:w-[40%] flex flex-col items-center md:px-5 lg:ml-65 xl:ml-90   ">
        <StoryRow setStoryModalFlag={setStoryModalFlag}  />
        <div className="w-full flex flex-col gap-4 xl:gap-5">
          {userFeed.length ? userFeed.map((item, index) => {
            return (
              <PostCard
                key={index}
                items={item}
                setflag={setflag}
                setPostId={setPostId}
              />
            );
          }) : <h1 className="xl:mt-5 text-center py-10 border border-gray-200 rounded-2xl  ">No Feed please follow some users</h1> }
        </div>
      </div>

      {flag === "like" ? (
        <LikesSection postId={postId} />
      ) : flag === "comment" ? (
        <CommentsSection postId={postId} />
      ) : null}

      <RightTrail flag={flag} />

      {storyModalFlag && <StoryModal setStoryModalFlag={setStoryModalFlag}/>}

    </div>
  );
};
export default Home;
