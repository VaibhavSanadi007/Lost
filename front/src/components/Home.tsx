import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import RightTrail from "./RightTrail";
import Sidebar from "./Sidebar";
import StoryRow from "./StoryRow";
import type { RootState } from "../store/reduxStore";
import axios from "axios";
import { useEffect, useState } from "react";
import { addPost } from "../store/postSlice";
import CommentsSection from "./AuthPage/CommentsSection";
import LikesSection from "./AuthPage/LikesSection";
import getUserData from "../custom_component/GetUserData"

const Home = () => {
  
  
  const [flag, setflag] = useState<string>("");
  const [postId, setPostId] = useState<string>("");
  
  const dispatch = useDispatch();
  const userFeed = useSelector((item: RootState) => item.post);
  
  const getFeed = async () => {
    const { data } = await axios.get("http://localhost:3000/post/feed", {
      withCredentials: true,
    });
    dispatch(addPost(data.data));
  };
  
  useEffect(() => {
    getFeed();
    // const params = new URLSearchParams(window.location.search);
    // const token = params.get("token");
    
    // console.log(token);
  }, []);
  
  getUserData();
  
  return (
    <div className="h-full w-full flex justify-center xl:gap-10 xl:px-25 px-1">
      <Sidebar />
      <div className="h-fit md:w-[50%] flex flex-col items-center md:ml-50 lg:ml-50 xl:ml-100 ">
        <StoryRow />
        <div className="flex flex-col gap-4 xl:gap-5">
          {userFeed.map((item, index) => {
            return (
              <PostCard
                key={index}
                items={item}
                setflag={setflag}
                setPostId={setPostId}
              />
            );
          })}
        </div>
      </div>

      {flag === "like" ? (
        <LikesSection postId={postId} />
      ) : flag === "comment" ? (
        <CommentsSection postId={postId} />
      ) : null}

      <RightTrail flag={flag} />
    </div>
  );
};
export default Home;
