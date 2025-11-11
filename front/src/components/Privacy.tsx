import axios from "axios";
import {  useState } from "react"
import { url } from "../App";
// import { useSelector } from "react-redux";
// import type { RootState } from "../store/reduxStore";

const Privacy = () => {
  // const userData = useSelector((item:RootState)=>item.user);
  const [privateMode,setPrivateMode] = useState<string>('private');

    const handlePrivacy = async (privacyValue:string)=>{
      await axios.patch(`${url}/auth/privacy`,{privacyValue},{withCredentials:true});
    }
  
   

  return (
    <div className="w-1/2 h-fit border border-gray-200 rounded-2xl px-10 py-5 flex flex-col gap-5">
          <h1 className="text-3xl font-semibold">Account privacy</h1>
          <p className="text-[0.8rem] text-gray-400">Your privacy is our priority. You have full control over your account visibility and shared information. You can choose who can view your profile, posts, and activities. We never share your personal data with third parties without your consent. All your information is securely stored and protected to ensure a safe experience on our platform.</p>
         
          <div className="w-[70%] border h-15 px-3 border-gray-200  rounded-2xl flex items-center justify-between ">
            <h1>Privacy Mode</h1>
            <select onChange={(e)=> {
              const value = e.target.value;
            setPrivateMode(value);
             handlePrivacy(value);
          }}  value={privateMode} className="outline-none text-[1rem] cursor-pointer ">
              <option value="public" className="">public</option>
              <option value="private">private</option>
            </select>
          </div>
          </div>
  )
}
export default Privacy