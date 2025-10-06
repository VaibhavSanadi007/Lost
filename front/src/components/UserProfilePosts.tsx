import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { url } from "../App";
import type { ObjType } from "../store/postSlice";

const UserProfilePosts = () => {
  const [value, setvalue] = useState<ObjType[]>([]);
  const { userId } = useParams();

  const handleGetPosts = async () => {
    const { data } = await axios.get(`${url}/post/userposts/${userId}`, {
      withCredentials: true,
    });

    setvalue([...data.data]);
  };

  useEffect(() => {
    handleGetPosts();
  }, []);

  return (
    <div className="text-white flex items-center justify-center xl:mt-5">
      <div className="grid grid-cols-3 xl:gap-2 xl:w-[60%] ">
        {value &&
          value.map((item, index) => (
            <div key={index} className="w-full  rounded-2xl overflow-hidden ">
              <img
                className="xl:max-h-100 xl:h-full xl:w-full rounded-2xl overflow-hidden  object-cover "
                src={item.postUrl}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
export default UserProfilePosts;
