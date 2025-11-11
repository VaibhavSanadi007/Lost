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
      ` ${url}/user/${userId}`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6 ">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur"
        aria-hidden="true"
        onClick={() => setopen(false)}
      />
      <div className="relative xl:w-[50%] h-fit bg-white  rounded-xl shadow-xl">
        {/* Header */}
        <div className="px-5 md:px-6 md:py-2  ">
          <h2 className="text-2xl font-semibold">Edit Profile</h2>
        </div>

        {/* Body */}
        <div className=" xl:h-100 xl:w-full lg:w-150  px-3 flex flex-col md:flex-row gap-5 ">


              <main className=" h-[30%] w-[30%]  lg:w-[80%] xl:w-full md:w-[50%]  flex items-center justify-center ">
                {/* Placeholder upload button */}
                <label htmlFor="fileInput" className="cursor-pointer  text-sm h-full w-full   xl:h-[90%] xl:w-[90%] "> 
                <img src={imageUrl?imageUrl:defaultIcon} className=" rounded bg-gray-300 object-cover" />
                   <input type="file" name="fileInput" id="fileInput" className="hidden"  onChange={handleChange} />
                </label>
              </main>
              
           

          <div className="w-full flex flex-col ">
          {/* Name */}
          <div className="">
            <label
              htmlFor="name"
              className="hidden md:block text-sm font-medium"
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
              className="hidden md:block text-sm font-medium "
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
            <label className="hidden md:block text-sm font-medium ">
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
            <label className="hidden md:block text-sm font-medium ">
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

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            // onClick={onClose}
            className="active:scale-95 cursor-pointer px-4 py-2 text-sm rounded-md border  hover:bg-white/10"
            onClick={() => setopen(false)}
          >
            Cancel
          </button>
          <button
            className="active:scale-95 cursor-pointer px-4 py-2 text-sm rounded-md text-white bg-black"
            onClick={() => handleEditUpload()}
          >
            Save Changes
          </button>
        </div>

        </div>

          </div>

      </div>
    </div>
  );
};
export default EditProfileModal;
