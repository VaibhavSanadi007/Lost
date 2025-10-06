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
};


const OpenPostModal: FC<property> = ({ setOpenPostModal , postId , postUrl}) => {
  
    const [description, setdescription] = useState<string>("");
    const [tags, settags] = useState<string>("");

  const dispatch = useDispatch();

  const handleDeletePost = async ()=>{
   await axios.delete(`${url}/post/delete/${postId}`,{withCredentials:true})
    dispatch(deletePost(postId));
  }

  const handleEditPost = async ()=>{
    const data =  await axios.patch(`${url}/post/update/${postId}`,{
      postDescription:description,
      postTags:tags
    },{withCredentials:true});
    dispatch(editPost({description,tags,postId}))

    console.log(data);
  }


  return (
    <div
      className=" w-full h-full fixed inset-0 bg-gray-950/85 flex items-center justify-center "
      onClick={() => setOpenPostModal(false)}
    >
      <div className="xl:w-[40%] absolute  bg-white rounded-2xl xl:py-5 xl:px-4 flex flex-col xl:gap-1.5 justify-between " onClick={(e)=>{
        e.stopPropagation();
      }}>

        <div className="flex items-center justify-between xl:px-10 ">

          <div className="flex items-center xl:gap-2 "  onClick={() => setOpenPostModal(false)}>
            <FaArrowLeftLong size={13} className="text-gray-400"  />
          <span className="text-gray-400 text-sm">Back</span>
          </div>

        <div className="flex xl:gap-3">
        <button className="text-white bg-red-400 rounded active:scale-95 xl:px-2 xl:py-1 cursor-pointer " onClick={() =>{ 
          handleDeletePost();
          setOpenPostModal(false)}} >Delete</button>
          <button className="text-white bg-red-400 rounded active:scale-95 xl:px-2 xl:py-1 cursor-pointer " onClick={() =>{ 
            handleEditPost();
            setOpenPostModal(false)
            }} >Save</button>
        </div>

        </div>

        <div className="flex flex-col xl:gap-2">
          <textarea name="" id="" className="bg-gray-100 resize-none scrollbar-hide outline-none xl:px-2 xl:py-1" placeholder="description" onChange={(e)=>setdescription(e.target.value)}></textarea>
          <textarea name="" id="" className="bg-gray-100 resize-none scrollbar-hide outline-none xl:px-2 xl:py-1" placeholder="tags" onChange={(e)=>settags(e.target.value)}></textarea>
        </div>

      <div className="w-full flex items-center justify-center xl:py-2">
        <label htmlFor="Img">
        <img src={postUrl?postUrl : defaIcon} className="xl:min-w-100 xl:h-100 object-cover"/>
        </label>
        <input type="file" name="Img" id="Img" className="hidden" />
      </div>

       

      </div>
      {/* comment like section */}
    </div>
  );
};
export default OpenPostModal;
