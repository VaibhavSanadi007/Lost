import type { FC } from "react";
import { MdOutlineAddReaction } from "react-icons/md";
import defaulticon from '../assets/default_profile_pic.jpg';
type property = {
  setStoryModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

const StoryRow: FC<property> = ({ setStoryModalFlag }) => {
 
 return (
    <div className="w-full  flex justify-center py-1.5 xl:py-2 ">
      <div className="h-25 w-[80%] md:w-140   xl:h-30  border border-gray-200 rounded-2xl overflow-x-auto  flex items-center pl-2 xl:pl-2 pr-2 xl:gap-3 gap-3 scrollbar-hide ">
        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-center justify-center bg-gray-100 active:scale-95 flex-shrink-0`}
         onClick={()=>setStoryModalFlag(true)}>
         <div className="flex flex-col items-center gap-1.5">
           <MdOutlineAddReaction size={25} />
            <h1 className=" border-b border-b-gray-300 text-[0.7rem]">Create story</h1>
         </div>

        </div>


        {/* array of stories */}

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">Omen</h1>
        </div>  

        {/* array of stories end  */}
     
      </div>
    </div>
  );
};
export default StoryRow;
