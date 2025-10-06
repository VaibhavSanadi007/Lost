import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../App";
import OpenPostModal from "./OpenPostModal";
import { useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";

const UserPosts = () => {
  const { userId } = useParams();
  const postData = useSelector((items: RootState) => items.post);

  const value = postData.filter((item) => item.postUserId._id === userId);

  const [openPostModal, setOpenPostModal] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [postUrl,setPostUrl] = useState<string>("");

  const handleGetPosts = async () => {
    await axios.get(`${url}/post/userposts/${userId}`, {
      withCredentials: true,
    });
  };

  useEffect(() => {
    handleGetPosts();
  }, []);
  return (
    <div className="md:ml-70 lg:ml-75 xl:ml-70 flex items-center justify-center   ">
      <div className="grid grid-cols-3 gap-2 xl:gap-2 w-[80%] xl:w-[60%] ">
        {value &&
          value.map((item, index) => (
            <div
              key={index}
              className="w-full rounded overflow-hidden"
              onClick={() => {
                setPostId(item._id);
                setOpenPostModal(!openPostModal);
                setPostUrl(item.postUrl);
              }}
            >
              {!item.postType || item.postType === "Image" ? (
                <img
                  className="xl:max-h-100 xl:h-full xl:w-full  overflow-hidden  object-cover "
                  src={item.postUrl}
                />
              ) : (
                <div className="w-full h-full flex justify-center rounded-2xl">
                  <video controls width={500}>
                    <source src={item.postUrl} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          ))}

        {openPostModal && (
          <OpenPostModal setOpenPostModal={setOpenPostModal} postId={postId} postUrl={postUrl} />
        )}
      </div>
    </div>
  );
};
export default UserPosts;
