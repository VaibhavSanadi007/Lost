import axios from "axios";
import { url } from "../../App";
import { useEffect, useState, type FC } from "react";
import moment from "moment";
import { CiMenuKebab } from "react-icons/ci";
import type { menuType } from "../MessageBox";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/reduxStore";
import { deleteComment, editComment, InitializeComment } from "../../store/commentSlice";
type property = {
  postId: string;
};

const CommentsSection: FC<property> = ({ postId }) => {
  const userData = useSelector((item:RootState)=>item.user);
  const commentData = useSelector((item:RootState)=>item.comment);
  
  const disptach = useDispatch();
  const [commentId,setCommentId] = useState<string>('');
  const [editBoxOpen,setEditBoxOpen] = useState<boolean>(false);
   const [EditInput, setEditInput] = useState<string>("");

const [commentOpen, setCommentOpen] = useState<menuType>({
      visible: false,
      x: 0,
      y: 0,
      msgId: '',
    });

     const handleRightClick = (e: any, userId: string) => {
    e.preventDefault();
    

    let posX = 280;
    let posY = e.clientY ;
    

    setCommentOpen({
      visible: true,
      x: posX,
      y: posY,
      msgId: userId,
    });

  
  };

  const handleMenuClose = () => {
    setCommentOpen({
      visible: false,
      x: 0,
      y: 0,
      msgId: "",
    });
  }



  const handlePostComments = async (postId: string) => {
    const { data } = await axios.get(`${url}/comment/fetch/${postId}`, {
      withCredentials: true,
    });
    disptach(InitializeComment(data.data));
 
  };

  const handleCommentDelete = async (commentId:string)=>{
    await axios.delete(`${url}/comment/delete/${commentId}`,{
      withCredentials:true,
    });
    disptach(deleteComment(commentId));
    handleMenuClose();
  }

  const handleEditComment = async (commentId:string)=>{
      handleMenuClose();  
     await axios.patch(`${url}/comment/update/${commentId}`,{
      commentText:EditInput
    },{
      withCredentials:true,
    });
    disptach(editComment({
    _id: commentId,
      commentText:EditInput
    }))
    setEditBoxOpen(false); 
  }

  useEffect(() => {
    handlePostComments(postId);
  }, [postId]);

  return (
    <div className="w-50  xl:w-[25%] xl:h-100 xl:py-2 fixed right-5 bg-white rounded-2xl">
      <div className="py-2 px-2.5 xl:px-2.5 xl:py-2 rounded-2xl border border-gray-200 " >
        <h1 className="border-b border-b-gray-200 xl:px-3 xl:py-1.5 font-semibold">
          Comments
        </h1>
        {

        commentData.length===0?
        <h1 className="text-center py-4">No comments 🫠</h1>
        : commentData?.map((items, index) => (
          <div
            key={index}
            className="flex items-center gap-4 xl:gap-2 my-2.5 xl:my-2.5 xl:px-1 xl:pr-5 xl:py-1.5 bg-gray-100 rounded-2xl"
          >
            <img
              src={items.commentUserId.dp}
              className="h-8 w-8 xl:h-10 xl:w-10 rounded-2xl object-cover"
            />

            <div className="xl:w-[90%]">
              <div className="flex items-end xl:gap-2 ">
                <h1 className="text-gray-400">{items.commentUserId.name}</h1>
                <h1 className="text-[0.6rem] text-gray-300 xl:pb-0.5 hidden lg:block">
                  {moment(items.updatedAt).fromNow()}
                </h1>
              </div>
              <h1 className="text-[0.8rem]">{items.commentText}</h1>
            </div>

          { items.commentUserId._id === userData._id ? <CiMenuKebab
          id={items._id}
              className="relative hidden lg:block "
              onClick={(e)=> {
                 handleRightClick(e,items.commentUserId._id);
                setCommentId(e.currentTarget.id)
              }
               }
            /> : ''
          }
          </div>
        ))}

        {
        commentOpen.visible && (
          <div  style={{
            position: "absolute",
            top: commentOpen.y,
            left: commentOpen.x,
            zIndex: 100,
          }} className=" xl:py-2 xl:w-15 xl:px-1 xl:text-[0.9rem] bg-black text-white rounded cursor-pointer">
            <h1 className=" hover:bg-white/20 xl:px-1 xl:mb-0.5 rounded " onClick={()=>setEditBoxOpen(true)}>
              Edit
            </h1>
            <h1 className="  xl:px-1 hover:bg-red-400 xl:mb-0.5 rounded " onClick={()=>handleCommentDelete(commentId)} >
              Delete
            </h1>
            <h1 className="  xl:px-1 hover:bg-sky-400 rounded " onClick={()=>handleMenuClose()}>
              Cancel
            </h1>
          </div>
        )
        }
      </div>
      {editBoxOpen && (
        <div className="z-101 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center   ">
          <div className="bg-gray-200 xl:h-40 flex flex-col justify-between xl:w-70 rounded xl:p-2">
            <h1 className="text-center">Message Edit </h1>
            <textarea
              className="xl:h-30 w-full resize-none bg-gray-300 outline-none scrollbar-hide xl:p-2 rounded"
              onChange={(e) => setEditInput(e.target.value)}
              // defaultValue={msgMetaData.msg}
            ></textarea>
            <div className="flex items-center justify-end xl:px-5 xl:gap-2">
              <button
                className="bg-red-400 text-white xl:w-10 xl:py-2 text-[0.7rem] rounded active:scale-95"
                onClick={() => setEditBoxOpen(false)}
              >
                cancel
              </button>
              <button
                className="bg-sky-400 text-white xl:w-10 xl:py-2 text-[0.7rem]  rounded active:scale-95"
                onClick={() => handleEditComment(commentId)}
              >
                save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CommentsSection;
