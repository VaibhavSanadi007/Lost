import { useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CiImageOn } from "react-icons/ci";

const PostCreateCard = () => {
  const navigate = useNavigate();
  const [description, setdescription] = useState<string>("");
  const [tags, settags] = useState<string>("");
  const [file, setfile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState("Image");

  const userData = useSelector((item: RootState) => item.user);

  const handlefile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setfile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formdata = new FormData();
    formdata.append("postDescription", description);
    formdata.append("postTags", tags);
    formdata.append("file", file);
    formdata.append("postType",mediaType);

    await axios.post(`http://localhost:3000/post/create`, formdata, {
      withCredentials: true,
    });
    navigate("/home");
  };

  const handleCaption = async () => {
    if (!file) return;
    const formdata = new FormData();
    formdata.append("file", file);
    const { data } = await axios.post(
      `http://localhost:3000/post/getcaption`,
      formdata,
      { withCredentials: true }
    );
    setdescription(data.caption);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-200  xl:w-[50%] 2xl:w-[40%]">
      {/* Header: avatar + name */}
      <div className="px-4 sm:px-6 pt-4 flex items-center gap-3">
        {/* Avatar: use bg as placeholder; replace src if needed */}
        <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
          <img
            src={userData.dp}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{userData.name}</p>
          <p className="text-xs text-gray-500 truncate">@{userData.username}</p>
        </div>
      </div>

      {/* Body: textarea */}
      <div className="px-4 xl:h-30 sm:px-6 pt-3">
        <textarea
          rows={3}
          value={description}
          placeholder="What's happening?"
          onChange={(e) => setdescription(e.target.value)}
          className="w-full h-full scrollbar-hide resize-none rounded-md border-0 focus:ring-0 text-sm outline-none xl:p-2 bg-gray-100 placeholder:text-gray-400"
        />
      </div>
      <div className="px-4 xl:h-15  sm:px-6 pt-3">
        <textarea
          rows={3}
          placeholder="Tags "
          onChange={(e) => settags(e.target.value)}
          className="w-full h-full scrollbar-hide resize-none rounded-md border-0 focus:ring-0 text-sm outline-none xl:p-2 bg-gray-100 placeholder:text-gray-400"
        />
      </div>

      {/* Divider */}
      <div className="mt-3 border-t border-gray-200" />

      {/* Footer actions */}
      <div className="px-4 sm:px-6 py-3 flex items-center gap-3 ">
        {/* Media button on the left */}
        <select
          className="bg-black xl:w-15 text-center py-1 px-2 xl:px-0 xl:py-1 rounded outline-none text-white cursor-pointer appearance-none"
          onChange={(e) => setMediaType(e.target.value)}
        >
          <option value="Image" className="outline-none">
            Image
          </option>
          <option value="Video" className="outline-none">
            Video
          </option>
        </select>

        <label
          htmlFor="fileinput"
          className="xl:h-10 cursor-pointer active:scale-95"
        >
          <CiImageOn size={40} />
        </label>
        <input
          type="file"
          id="fileinput"
          onChange={(e) => handlefile(e)}
          className="hidden"
          accept="image/*,video/*"
        />

        <div className="flex-1" />

        {/* Publish button */}
        <button
          type="button"
          onClick={handleCaption}
          className="px-2 py-2 xl:px-4 xl:py-2 rounded-md text-white text-sm font-medium bg-gradient-to-r from-amber-200 to-yellow-500 cursor-pointer active:scale-95"
        >
          AI Caption
        </button>
        <button
          type="button"
          onClick={handleUpload}
          className="px-2 py-2 xl:px-4 xl:py-2 rounded-md text-white text-sm font-medium bg-gradient-to-r from-teal-200 to-teal-500 cursor-pointer active:scale-95"
        >
          Publish Post
        </button>
      </div>
    </section>
  );
};
export default PostCreateCard;
