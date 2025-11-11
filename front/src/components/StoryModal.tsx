import axios from "axios";
import {  useState, type FC } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdOutlineFileUpload } from "react-icons/md";
import { url } from "../App";

type property = {
  setStoryModalFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

const StoryModal: FC<property> = ({ setStoryModalFlag }) => {
  const [file,setFile] = useState<File | null>(null);
  const [Text,setText] = useState<string>('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>)=>{
    if( e.target.files && e.target.files?.length>0){
      setFile(e.target.files[0]);
    }
  }

  const handleUploadText = async ()=>{
    await axios.post(`${url}/story/addtext`,{
      storytype:"text",
      storytext: Text,
      duration: 5,
    },{
      withCredentials: true,
    })
  }

  const handleUploadFile = async ()=>{
    if(!file) return;
    const formdata = new FormData();
    formdata.append('storytype',file?.type.startsWith('image')?'image':'video');
    formdata.append('file',file);
    
    await axios.post(`${url}/story/addfile`,formdata,{
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

  }

  const handleUpload = ()=>{
    if(file){
      handleUploadFile();
    }else{
      handleUploadText();
    }
  }

  return (
    <div className="w-full h-full bg-black/80 fixed top-0 left-0 flex items-center justify-center text-white">
      <div className="h-[80%] w-[80%] lg:w-[40%] xl:w-[30%] rounded-2xl flex flex-col gap-2.5 ">
        <div className="flex items-center justify-between px-6 h-[5%]">
          <FaArrowLeft
            className="active:scale-90"
            onClick={() => setStoryModalFlag(false)}
          />
          <h1 className="text-xl ">Create story</h1>
        </div>
        <textarea
        onChange={(e)=>setText(e.target.value)}
          defaultValue="whats on your mind today?"
          className="rounded-2xl bg-black/10 backdrop-blur-xl resize-none outline-none h-[40%] w-full p-3 overflow-x-auto scrollbar-hide"
        />

        <div className="flex items-center gap-10 ">
          <div className="w-full border-b border-b-gray-100"></div>
          <h1>OR</h1>
          <div className="w-full border-b border-b-gray-100"></div>
        </div>

        <div className="flex items-center justify-between gap-5   h-[10%] rounded-xl ">
          <label
            htmlFor="file"
            className={`cursor-pointer text-center w-full  py-3 rounded-xl text-whiteactive:scale-95 bg-black flex items-center  justify-center gap-2 `}
          >
            <MdOutlineFileUpload size={25} />
            Image / Video
          </label>
          <input type="file" name="file" id="file" className="hidden" onChange={(e)=>handleFile(e)} />
        </div>

        <div className="flex items-center justify-center h-[20%] ">
          <button
            className=" active:scale-95 border-b cursor-pointer text-white py-0.5"
            onClick={() =>{ setStoryModalFlag(false); handleUpload()}}
          >
            Save story
          </button>
        </div>

      </div>
    </div>
  );
};
export default StoryModal;
