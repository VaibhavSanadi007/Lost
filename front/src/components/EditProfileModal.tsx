import axios from "axios";
import { useState, type FC } from "react";
import { useDispatch} from "react-redux";
import { useParams } from "react-router-dom";
import { addUser } from "../store/userSlice";

import defaultIcon from '../assets/default_profile_pic.jpg';

import { url } from "../App";

type property = {
  setopen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditProfileModal: FC<property> = ({ setopen }) => {
  const [username, setusername] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [tags, settags] = useState<string>("");
  const [file, setfile] = useState<File | null>(null);

  const [imageUrl, setImageUrl] = useState<string>("");


  const { userId } = useParams();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setfile(e.target.files[0]);
      const imgFile = e.target.files?.[0];
      const url1 = URL.createObjectURL(imgFile);
      setImageUrl(url1);
    }
  };

  const handleEditUpload = async () => {
    if (!file) return;


    const formData = new FormData();
    formData.append("file", file);

    if(username){
      formData.append("username", username);
    }
    if(name){
      formData.append("name", name);
    }
    if(description){
      formData.append("description", description);
    }
    if(tags){
      formData.append("tags", tags);
    }

    const {data} = await axios.patch(
      "http://localhost:3000/user/" + userId,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(addUser(data.data));

    setopen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex sm:items-center justify-center sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/85"
        aria-hidden="true"
        onClick={() => setopen(false)}
      />
      <div className="relative xl:w-[35%] h-fit bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="px-5 sm:px-6 py-2 border-b border-gray-200  ">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 space-y-1.5  ">
          {/* Profile picture + Cover */}
          <div className="">
            {/* Avatar column */}
            <div className=" xl:mb-2">

              <main className="flex items-center xl:gap-3">
                {/* Placeholder upload button */}
                <label htmlFor="fileInput" className=" xl:px-2 xl:py-1 cursor-pointer rounded xl:text-sm "> Upload img
                <img src={imageUrl?imageUrl:defaultIcon} className="mt-2 xl:h-40 xl:w-40 rounded-2xl bg-gray-300 object-cover" />
                   <input type="file" name="fileInput" id="fileInput" className="hidden"  onChange={handleChange} />
                </label>
              </main>
              
            </div>

          </div>

          {/* Name */}
          <div className="">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              onChange={(e) => setname(e.target.value)}
              // defaultValue="John Warren"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1  focus:ring-gray-400"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your user name"
              onChange={(e) => setusername(e.target.value)}
              // defaultValue="john_warren"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1  focus:ring-gray-400"
            />
          </div>

          {/* Description (renamed from Bio) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              onChange={(e) => setdescription(e.target.value)}
            
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1  focus:ring-gray-300"
            />
          </div>

          {/* Tags input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              onChange={(e) => settags(e.target.value)}
              placeholder="e.g., #design, #product, #startups"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1  focus:ring-gray-400"
            />
            <p className="mt-2  text-xs text-gray-500"></p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            // onClick={onClose}
            className="active:scale-95 cursor-pointer px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
            onClick={() => setopen(false)}
          >
            Cancel
          </button>
          <button
            className="active:scale-95 cursor-pointer px-4 py-2 text-sm rounded-md text-white bg-gradient-to-r from-indigo-600 to-fuchsia-500 hover:from-indigo-700 hover:to-fuchsia-600"
            onClick={() => handleEditUpload()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditProfileModal;
