import {
  useEffect,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";

import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";

type storydatatype = {
  mediaUrl?: string;
  storytype: "image" | "video" | "text";
  storytext?: string;
  duration?: number;
};

type property = {
  setStoryOpen: Dispatch<SetStateAction<boolean>>;
  storyData: storydatatype[];
};

const StoryView: FC<property> = ({ setStoryOpen, storyData }) => {

  const [currentIdx,setCurrentIdx] = useState(0);
  console.log(currentIdx)

  useEffect(() => {
    if (!storyData) return;

    const storyTimeId = setTimeout(() => {
      setStoryOpen(false);
    }, (storyData[currentIdx].duration || 2) * 1000);

    return () => {
      clearTimeout(storyTimeId);
    };
  }, [storyData]);

  const handlePrev = (e:any)=>{
    e.stopPropagation();
    if(currentIdx > 0){
      setCurrentIdx(prev => prev - 1);
    }
  }

  const handleNext = (e:any)=>{
    e.stopPropagation();
    if(currentIdx < storyData.length-1){
      setCurrentIdx(prev => prev + 1);
    }
  }


  return (
    <div
      className="w-full h-full bg-black/70 backdrop-blur absolute top-0 left-0 z-1 flex items-center justify-center gap-10"
      onClick={() => setStoryOpen(false)}
    > 
    <GrFormPrevious  size={30}  className="text-white cursor-pointer hover:text-white/50 " onClick={handlePrev}/>
      <div
        className=" w-[40%] h-[95%] rounded flex items-center justify-center px-10 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {
          storyData[currentIdx].storytype === "image" ? (
            <img src={storyData[currentIdx].mediaUrl} className="h-100 w-120 object-contain" />
          ) : storyData[currentIdx].storytype === "video" ? (
            <video controls>
              <source src={storyData[currentIdx].mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="bg-white/10 rounded-2xl h-[40%] w-[90%] flex items-center justify-center">
              <h1 className="text-white">{storyData[currentIdx].storytext}</h1>
            </div>
          )
        }
      </div>
      <GrFormNext size={30}  className="text-white cursor-pointer hover:text-white/50" onClick={handleNext} />
    </div>
  );
};
export default StoryView;
