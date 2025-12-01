import { useEffect, useState, type FC } from "react";
import { MdOutlineAddReaction } from "react-icons/md";
import defaulticon from '../assets/default_profile_pic.jpg';
import StoryView from "./StoryView";
import { url } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setStories } from "../store/StorySlice";
import type { RootState } from "../store/reduxStore";

type property = {
  setStoryModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
};



type storydatatype = {
  mediaUrl?: string;
  storytype: "image" | "video" | "text";
  storytext?: string;
  duration?: number;
}

const StoryRow: FC<property> = ({ setStoryModalFlag }) => {
 const [storyOpen,setStoryOpen] = useState(false);
 const dispatch = useDispatch();
const story = useSelector((i:RootState)=> i.story);


   const [storyData,setStoryData] = useState<storydatatype[]>([]);
 
  const handleGetStory = async () => {
    const { data } = await axios.get(`${url}/story/getStory`, {
      withCredentials: true,
    });
    dispatch(setStories(data.data));
  };

  useEffect(() => {
    handleGetStory();
  }, []);

 return (
    <div className="w-full  flex justify-center py-1.5 xl:py-2 ">
       {
          storyOpen && <StoryView setStoryOpen={setStoryOpen} storyData={storyData}/>
        }
      <div className="h-25  xl:w-full w-[100%]  xl:h-30  border border-gray-200 rounded-2xl overflow-x-auto  flex items-center pl-2 xl:pl-2 pr-2 xl:gap-3 gap-3 scrollbar-hide ">
        <div
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-center justify-center bg-gray-100 active:scale-95 flex-shrink-0`}
         onClick={()=>setStoryModalFlag(true)}>
         <div className="flex flex-col items-center gap-1.5">
           <MdOutlineAddReaction size={25} />
            <h1 className=" border-b border-b-gray-300 text-[0.7rem]">Create story</h1>
         </div>

        </div>
       

        {/* array of stories */}
        {
          story && story.map((item,index)=>(

        <div key={index}
          onClick={()=>{setStoryOpen(true); setStoryData(item)}}
          className={`w-15 h-20 xl:w-20 xl:h-25 rounded-2xl border border-gray-300 relative cursor-pointer p-2 flex items-end justify-center active:scale-98 flex-shrink-0`}
          style={{
          backgroundImage: `url(${item[0].ownerId.dp || defaulticon})`,
          backgroundPosition: `center`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `cover`,
          }} >
          <h1 className=" border-b border-b-gray-300 text-[0.7rem] text-white">{item[0].ownerId.name.split(" ").slice(0,1)}</h1>
        </div>  
          ))
        }

        

        {/* array of stories end  */}
     
      </div>
    </div>
  );
};
export default StoryRow;
