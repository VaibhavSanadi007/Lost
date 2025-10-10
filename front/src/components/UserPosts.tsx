import { useState, type FC } from "react";
import OpenPostModal from "./OpenPostModal";

import defaulticon from '../assets/default_profile_pic.jpg';
import type { ObjType } from "../store/postSlice";

type property = {
  value : ObjType[];
}

const UserPosts:FC<property> = ({value}) => {

  const [openPostModal, setOpenPostModal] = useState<boolean>(false);
  const [postId, setPostId] = useState<string>("");
  const [postUrl,setPostUrl] = useState<string>("");
  const [postDescription,setPostDescription] = useState<string | undefined>("");


  return (
    <div className="md:ml-70 lg:ml-75 xl:ml-70 flex items-center justify-center   ">
      <div className="grid grid-cols-3 gap-2 xl:gap-5 w-[80%] xl:w-[60%] ">
        {value &&
          value.map((item, index) => (
            <div
              key={index}
              className="w-full rounded overflow-hidden"
              onClick={() => {
                setPostId(item._id);
                setOpenPostModal(!openPostModal);
                setPostUrl(item.postUrl);
                setPostDescription(item.postDescription);
              }}
            >
              {!item.postType || item.postType === "Image" ? (
                <img
                  className="xl:max-h-80 xl:h-full xl:w-full  overflow-hidden  object-contain "
                  src={item.postUrl? item.postUrl : defaulticon}
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center rounded-2xl   ">
                  <video controls  width={500} >
                    <source src={item.postUrl?item.postUrl:defaulticon} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          ))}

        {openPostModal && (
          <OpenPostModal setOpenPostModal={setOpenPostModal} postId={postId} postUrl={postUrl} postDescription={postDescription}  />
        )}
      </div>
    </div>
  );
};
export default UserPosts;
