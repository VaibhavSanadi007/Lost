import axios from "axios";
import { useEffect, useState } from "react"
import { url } from "../App";
import { useSelector } from "react-redux";
import type { RootState } from "../store/reduxStore";

const Privacy = () => {
  const userData = useSelector((item:RootState)=>item.user);
  const [flag,setflag] = useState<boolean>(userData.privateMode);
  useEffect(()=>{
    
    console.log(userData)
    const handlePrivacy = async ()=>{
      await axios.patch(`${url}/auth/privacy`,{privateMode:flag},{withCredentials:true});
    }
    handlePrivacy();
  },[flag]);

  return (
    <div className="w-1/2 h-fit border border-gray-200 rounded-2xl px-10 py-5 flex flex-col gap-5">
          <h1 className="text-3xl font-semibold">Account privacy</h1>
          <p className="text-[0.8rem] text-gray-400">Your privacy is our priority. You have full control over your account visibility and shared information. You can choose who can view your profile, posts, and activities. We never share your personal data with third parties without your consent. All your information is securely stored and protected to ensure a safe experience on our platform.</p>
         
          <div className="w-[70%] border h-15 px-3 border-gray-200 rounded-2xl flex items-center justify-between ">
            <h1>Private account</h1>
            <div onClick={()=>{ setflag(flag ? false : true ); }} className={`cursor-pointer border border-gray-200 h-9 w-17 rounded-2xl relative flex items-center px-2 ${flag? 'justify-end bg-gray-200':''} `}>
              <div className="absolute rounded-full h-6 w-6 bg-black" />
            </div>
          </div>
          </div>
  )
}
export default Privacy