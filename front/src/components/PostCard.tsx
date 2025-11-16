import { useState, type FC } from "react";
import { VscSend } from "react-icons/vsc";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { LiaCommentSolid } from "react-icons/lia";
import { RiShareForwardLine } from "react-icons/ri";

import type { RootState } from "../store/reduxStore";

import { useNavigate } from "react-router-dom";
import { addLike, removeLike, type ObjType } from "../store/postSlice";
import moment from "moment";
import { url } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addComment } from "../store/commentSlice";
import defaultIcon from '../assets/default_profile_pic.jpg';
export type property = {
  items: ObjType;
  setflag: React.Dispatch<React.SetStateAction<string>>;
  setPostId: React.Dispatch<React.SetStateAction<string>>;
};

const PostCard: FC<property> = ({ items, setflag, setPostId }) => {
  const navigate = useNavigate();

  const userData = useSelector((item: RootState) => item.user);
  const dispatch = useDispatch();

  const [commentInput, setcommentInput] = useState("");

  const handleAddLike = async (postId: string) => {
    await axios
      .post(
        `${url}/post/like`,
        {
          postId,
        },
        { withCredentials: true }
      )
      .then(() => {
        dispatch(
          addLike({
            _id: postId,
            userId: userData._id,
          })
        );
      });
  };

  const handleRemoveLike = async (postId: string) => {
    await axios
      .post(
        `${url}/post/unlike`,
        {
          postId,
        },
        { withCredentials: true }
      )
      .then(() => {
        dispatch(
          removeLike({
            _id: postId,
            userId: userData._id,
          })
        );
      });
  };

  const handleComment = async (postId: string) => {
    await axios
      .post(
        `${url}/comment/create/${postId}`,
        {
          commentText: commentInput,
        },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        const commentData = data.data;
        dispatch(addComment({
          _id: commentData._id,
          commentText:commentData.commentText,
          commentUserId: {
            _id: commentData.commentUserId._id,
            name: commentData.commentUserId.name,
            username: commentData.commentUserId.username,
            dp: commentData.commentUserId.dp,
          },
          postId: commentData.postId,
          createdAt: commentData.createdAt,
        }));
        setcommentInput("");
      });
  };
  
  return (
    <article className="  border border-gray-200 rounded-2xl lg:w-110  xl:w-140  overflow-hidden ">
      {/* Header */}
      <div className="xl:h-17 h-15 px-4 xl:px-8 flex items-center gap-3">
        <div className="h-13 w-13 rounded-2xl overflow-hidden active:scale-95 cursor-pointer">
          <img
            src={items.postUserId.dp?items.postUserId.dp:defaultIcon}
            className="h-full w-full object-cover  "
            onClick={() => navigate(`/viewuser/${items.postUserId._id}`)}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center ">
            <div>
              <h1
                className="font-semibold cursor-pointer active:scale-95"
                onClick={() => navigate(`/viewuser/${items.postUserId._id}`)}
              >
                {items.postUserId.name}
              </h1>
              <h3 className="text-sm text-gray-500">
                @{items.postUserId.username}
              </h3>
            </div>
            <span className="text-xs text-gray-500">
              {moment(items.createdAt).fromNow()}
            </span>
          </div>
        </div>
      </div>

      {/* Big image (Unsplash) */}
      <div className="xl:w-full xl:px-5 lg:px-5  xl:py-2 flex flex-col xl:gap-2 justify-center border-y border-gray-200 ">
        <p className="text-sm  ">
          {items.postDescription}
          <br />
          {items.postTags ? items.postTags?.map((items, index) => (
            <span key={index} className="text-blue-800">
              {items}
            </span>
          )) : ''}
        </p>

        {!items.postType || items.postType === "Image" ? (
          <img
            className="  lg:h-80  object-contain  xl:h-80 "
            src={items.postUrl}
            alt="Team working in an office from Unsplash"
          />
        ) : (
          <div className="w-full flex justify-center">
            <video controls width={500}>
              <source src={items.postUrl} type="video/mp4" />
            </video>
          </div>
        )}

        <div className="w-full xl:px-5 px-5 h-7 xl:h-7 flex items-end justify-between ">
          <div className="flex items-center justify-center xl:gap-1">
            {items.like.includes(userData._id) ? (
              <BiSolidLike
                size={20}
                className={`active:scale-95 `}
                onClick={() => {
                  handleRemoveLike(items._id);
                }}
              />
            ) : (
              <BiLike
                size={20}
                className={`active:scale-95 text-gray-400`}
                onClick={() => {
                  handleAddLike(items._id);
                }}
              />
            )}

            <h1
              onClick={() => {
                setflag("like");
                setPostId(items._id);
              }}
            >
             {items.like.length} Likes
            </h1>
          </div>

          <div className="flex items-center justify-center xl:gap-1" onClick={() => {
                setflag("comment");
                setPostId(items._id);
              }}>
            <LiaCommentSolid size={20} className="active:scale-95 text-gray-400" />
            <h1>
              Comments
            </h1>
          </div>

          <div className="flex items-center justify-center xl:gap-1">
            <RiShareForwardLine
              size={20}
              className="active:scale-95 text-gray-400"
              onClick={() => {
                toast.info("share is under contruction");
              }}
            />
            <h1>Share</h1>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="xl:h-15 h-15 xl:w-full px-5 xl:px-10 flex items-center justify-between ">
        <input
          className="xl:w-90 h-10 xl:h-10 rounded-2xl border border-gray-200 xl:px-3 px-3 outline-none "
          type="text"
          value={commentInput}
          placeholder="Write your comment . . ."
          onChange={(e) => setcommentInput(e.target.value)}
        />
        <VscSend
          size={25}
          className="cursor-pointer active:scale-95"
          onClick={() =>{ handleComment(items._id); setcommentInput('')}}
        />
      </div>
    </article>
  );
};
export default PostCard;
