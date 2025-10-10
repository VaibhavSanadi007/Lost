import axios from "axios";
import { url } from "../../App";
import { useEffect, useState, type FC } from "react";
import { BiSolidLike } from "react-icons/bi";
type property = {
  postId: string;
};

type obj = {
  dp: string;
  name: string;
  updatedAt: string;
  username: string;
  _id: string;
};

const LikesSection: FC<property> = ({ postId }) => {
  const [likeArr, setLikeArr] = useState<obj[]>([]);

  const handlePostLikes = async (postId: string) => {
    const { data } = await axios.get(`${url}/post/likes/${postId}`, {
      withCredentials: true,
    });
    setLikeArr(data.data.like);
  };

  useEffect(() => {
    handlePostLikes(postId);
  }, [postId]);

  return (
    <div className=" w-50 h-70 md:h-80 lg:w-100 xl:w-[25%] rounded-2xl lg:h-100 xl:py-2 fixed xl:right-5 right-5 bg-white  ">
      <div className=" xl:px-2.5 px-2 xl:py-2 rounded-2xl border border-gray-200">
        <h1 className="border-b border-b-gray-200 px-2 xl:px-3 xl:py-1.5 font-semibold">  
          Likes
        </h1>

        {
             likeArr.length===0?
        <h1 className="text-center py-4">No Likes 🫠</h1>
          :likeArr.map((item, index) => (
          <div
            key={index}
            className="flex xl:gap-2  my-2 xl:my-2.5  xl:px-2.5 py-1.5 xl:py-1.5 bg-gray-100 rounded-2xl"
          >
            <img src={item.dp} className="h-10 w-10 xl:w-10 rounded-2xl object-cover"/>

            <div className=" lg:w-[90%] flex items-center justify-between lg:px-2 xl:pr-5 ">
              <div className="xl:w-70 w-30">
                <h1 className="xl:w-full">{item.name}</h1>
              <h1 className="text-sm text-gray-300">@{item.username}</h1>
              </div>
                <BiSolidLike size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LikesSection;
