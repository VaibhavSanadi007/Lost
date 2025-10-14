import {
  useEffect,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";

type storydatatype = {
  mediaUrl?: string;
  storytype: "image" | "video" | "text";
  storytext?: string;
  duration?: number;
};

type property = {
  setStoryOpen: Dispatch<SetStateAction<boolean>>;
  storyData: storydatatype;
};

const StoryView: FC<property> = ({ setStoryOpen, storyData }) => {
  useEffect(() => {
    if (!storyData) return;

    const storyTimeId = setTimeout(() => {
      setStoryOpen(false);
    }, (storyData.duration || 2) * 1000);

    return () => {
      clearTimeout(storyTimeId);
    };
  }, [storyData]);

  return (
    <div
      className="w-full h-full bg-black/70 backdrop-blur absolute top-0 left-0 z-1 flex items-center justify-center"
      onClick={() => setStoryOpen(false)}
    >
      <div
        className=" w-[40%] h-[95%] rounded flex items-center justify-center px-10 bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {
          storyData.storytype === "image" ? (
            <img src={storyData.mediaUrl} className="h-100 w-120 object-contain" />
          ) : storyData.storytype === "video" ? (
            <video controls>
              <source src={storyData.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="bg-white/10 rounded-2xl h-[40%] w-[90%] flex items-center justify-center">
              <h1 className="text-white">{storyData.storytext}</h1>
            </div>
          )
        }
      </div>
    </div>
  );
};
export default StoryView;
