import { useState, type FC } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import defaIcon from '../assets/default_profile_pic.jpg';

import axios from "axios";
import { url } from "../App";
import { useDispatch } from "react-redux";
import { deletePost, editPost } from "../store/postSlice";

type property = {
  setOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  postId: string;
  postUrl: string;
  postDescription: string | undefined;
};


const OpenPostModal: FC<property> = ({ setOpenPostModal , postId , postUrl , postDescription  }) => {
  
    const [description, setdescription] = useState<string | undefined>(postDescription);
    const [tags, settags] = useState<string>(``);

  const dispatch = useDispatch();

  const handleDeletePost = async ()=>{
   await axios.delete(`${url}/post/delete/${postId}`,{withCredentials:true})
    dispatch(deletePost(postId));
  }

  const handleEditPost = async ()=>{
     await axios.patch(`${url}/post/update/${postId}`,{
      postDescription:description,
      postTags:tags
    },{withCredentials:true});
    dispatch(editPost({description,tags,postId}))

  }
  

  return (
    <div
      className=" w-full h-full fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center "
      onClick={() => setOpenPostModal(false)}
    >
      <div className="xl:w-[40%] absolute  bg-white/10  rounded-xl xl:py-5 xl:px-10 flex flex-col xl:gap-1.5 justify-between  " onClick={(e)=>{
        e.stopPropagation();
      }}>

        <div className="flex items-center justify-between ">

          <div className="flex items-center xl:gap-2 "  onClick={() => setOpenPostModal(false)}>
            <FaArrowLeftLong size={13} className="text-gray-400"  />
          <span className="text-gray-400 text-sm">Back</span>
          </div>

        <div className="flex xl:gap-3">
        <button className="text-white bg-red-500 rounded active:scale-95 xl:px-2 xl:py-1 cursor-pointer " onClick={() =>{ 
          handleDeletePost();
          setOpenPostModal(false)}} >Delete</button>
          <button className="text-white border border-white/10 rounded active:scale-95 xl:px-2 xl:py-1 cursor-pointer " onClick={() =>{ 
            handleEditPost();
            setOpenPostModal(false)
            }} >Save</button>
        </div>

        </div>


      <div className=" h-100 w-full flex items-center justify-center xl:py-4 xl:px-2">
        <label htmlFor="Img" className="xl:h-full">
        <img src={postUrl?postUrl : defaIcon} className=" xl:h-full object-contain"/>
        </label>
        <input type="file" name="Img" id="Img" className="hidden" />
      </div>

       
        <div className="flex flex-col xl:gap-2 text-white/50">
          <textarea name="" value={description} id="" className="border border-white/10 rounded resize-none scrollbar-hide outline-none xl:px-2 xl:py-1" placeholder="Edit description..." onChange={(e)=>setdescription(e.target.value)}></textarea>
          <textarea name="" value={tags} id="" className="border border-white/10 rounded  resize-none scrollbar-hide outline-none xl:px-2 xl:py-1" placeholder="Edit tags..." onChange={(e)=>settags(e.target.value)}></textarea>
        </div>

      </div>
      {/* comment like section */}
    </div>
  );
};
export default OpenPostModal;
