import type { FC } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import editIcon from "../assets/user-edit.png";

type property = {
  setopen: React.Dispatch<React.SetStateAction<boolean>>;
  setopenFollowers: React.Dispatch<React.SetStateAction<boolean>>;
  setopenFollowing: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProfileHeader: FC<property> = ({ setopen , setopenFollowers , setopenFollowing }) => {
  const items = useSelector((item: RootState) => item.user);
  return (
    // Card container
    <section className="bg-gray-100 border-gray-200 rounded-xl overflow-hidden xl:h-fit xl:w-[60%]">
   
      <div className="px-6 pt-4 pb-6   ">
        <div className="flex items-center justify-center xl:gap-5 ">
          
          <img
            src={items.dp}
            className="h-25 w-25 xl:h-40 xl:w-40 object-cover rounded-2xl sm:h-24 sm:w-24  "
          />
          <div className="flex flex-col ">
        <div className="flex  justify-between  xl:w-100 gap-3">
          <div className="">

            <div className="flex items-center  gap-2 ">
              <h1 className="text-lg sm:text-xl font-semibold">{items.name}</h1>
              {/* Verified tick as small pill */}
              <span className="inline-flex h-5 w-5 rounded-full bg-indigo-600 text-white items-center justify-center text-[10px]">
                ✓
              </span>
            </div>

            <p className="text-sm text-gray-500 ">{items.username}</p>

          </div>

          <button
            className="inline-flex  items-center gap-2 px-3 py-1.5 rounded-md active:scale-95 text-sm cursor-pointer"
            onClick={() => setopen(true)}
          >
            <img src={editIcon} className="h-10" />
         
          </button>

          </div>
        <p className="mt-3 xl:h-15  text-sm text-gray-700 ">
          {items.description}
        </p>

        <p className="mt-3 text-sm  text-blue-800 ">{items.tags}</p>

          {/* Edit button */}
        </div>


        
        </div>
        {/* Name row */}

        <div className="mt-4 xl:mx-35  border-t border-gray-200 " />

        <div className=" xl:h-15 flex  justify-center items-center gap-15 text-sm ">
          <p className="flex flex-col hover:border-b hover:border-gray-300 xl:p-1">
            <span className="text-2xl text-gray-700 font-bold text-center ">0</span> 
            <span className="text-gray-400"> Posts </span>
          </p>
          <p className="flex flex-col cursor-pointer hover:border-b hover:border-gray-300 xl:p-1" onClick={()=>setopenFollowers(true)}>
            <span className="text-2xl text-gray-700 font-bold text-center "  >{items.followers?items.followers.length:"0"}</span>
            <span className="text-gray-400  "  > Followers </span>
          </p>
          <p className="flex flex-col cursor-pointer hover:border-b hover:border-gray-300 xl:p-1" onClick={()=>setopenFollowing(true)}>
            <span className="text-2xl text-gray-700 font-bold text-center">{items.following?items.following.length:"0"}</span>
            <span className="text-gray-400"> Following </span>
          </p>
        </div>
      </div>
    </section>
  );
};
export default ProfileHeader;
