import axios from "axios";
import Sidebar from "./Sidebar";
import { url } from "../App";
import { useEffect, useState } from "react";
import defaultIcon from "../assets/default_profile_pic.jpg";
import { useNavigate } from "react-router-dom";

type obj = {
  _id: string;
  username: string;
  name: string;
  dp: string;
  description: string;
};

const Explore = () => {
  const navigate = useNavigate();
  const [recommend, setRecommend] = useState<obj[]>([]);
  const [searchResult, setSearchResult] = useState<obj[]>([]);
  const [searchInput,setSearchInput] = useState<string  | null>(null);
  const handleGetRecommend = async () => {
    const { data } = await axios.get(`${url}/user/recommend`, {
      withCredentials: true,
    });
    setRecommend(data.data);
  };


  const handleGetSearchedUser = async () => {
    const { data } = await axios.get(
      `${url}/user/search?query=${searchInput}`,
      { withCredentials: true }
    );
    setSearchResult(data.data);
  };


  useEffect(() => {

    const TimeOutId = setTimeout(() => {
      handleGetSearchedUser();
    }, 500);

    return ()=>{
      clearTimeout(TimeOutId);
    }
 
  }, [searchInput]);

  useEffect(() => {
    handleGetRecommend();
  }, []);

  return (
    <div className="w-full h-full md:pl-70 xl:pl-95 lg:pl-80 xl:pr-25 ">
      <Sidebar />
      <div className="w-full h-full">
        <div className="w-full h-15 my-2 xl:h-30 flex items-center  relative">
          <input
            type="search"
            placeholder="search"
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-50 h-13 xl:w-80 bg-gray-200 outline-none xl:py-2  px-3 rounded-2xl"
          />

         { searchInput && <div data-lenis-prevent className="absolute  h-125 xl:w-100 lg:w-80 lg:left-[30%] xl:left-[45%] 2xl:left-[35%] lg:top-10 xl:top-5 rounded-2xl overflow-hidden bg-black  xl:px-2  overflow-y-auto scrollbar-hide">
            {
              searchResult && searchResult.map((item,index)=>(

              <div key={index} className="border border-gray-100 xl:h-20 rounded-2xl overflow-hidden xl:p-2 flex xl:gap-2 xl:my-2.5 active:scale-95" onClick={()=>navigate(`/viewuser/${item._id}`)}>
                <img
                  src={item.dp? item.dp : defaultIcon}
                  className="h-15 w-15 xl:h-full xl:w-15 object-cover rounded-2xl"
                />
                <div className="text-white ">
                  <h1 >{item.name}</h1>
                  <h1 className="text-[0.7rem] text-gray-600 ">@{item.username}</h1>
                </div>
              </div>

              ))
            }
          </div>}

        </div>

        <div>
          <h1 className="py-2 px-2 w-fit rounded-2xl xl:w-fit xl:px-2 xl:py-2 xl:mb-1.5 mb-2 xl:rounded-2xl bg-black text-white">
            Recommended friends
          </h1>
          <div className=" xl:h-fit xl:w-full border border-gray-200 rounded-2xl flex flex-wrap gap-2 px-1 xl:gap-2 xl:px-1 xl:py-1.5 py-1">
            {recommend.map((item, index) => (
              <div
                key={index}
                className="xl:h-35 xl:w-35 flex flex-col items-center rounded-2xl border border-gray-200 xl:p-2"
                onClick={() => {
                  navigate(`/viewuser/${item._id}`);
                }}
              >
                <img
                  src={item.dp ? item.dp : defaultIcon}
                  className="h-15 w-15 xl:h-20 xl:w-20 rounded-2xl object-cover"
                />
                <h1 className="">{item.name}</h1>
                <h1 className="text-sm text-gray-300">@{item.username}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Explore;
