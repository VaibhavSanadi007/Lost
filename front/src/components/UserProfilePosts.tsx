
import type { FC } from 'react';
import defaulticon from '../assets/default_profile_pic.jpg';
import type { ObjType } from '../store/postSlice';

type property = {
  value : ObjType[];
}

const UserProfilePosts:FC<property> = ({value}) => {


  return (
    <div className="text-white flex items-center justify-center xl:mt-5">
      <div className="grid grid-cols-3 xl:gap-2 xl:w-[60%] ">
        {value &&
          value.map((item, index) => (
           <div
              key={index}
              className="w-full rounded overflow-hidden"
            
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
      </div>
    </div>
  );
};
export default UserProfilePosts;
