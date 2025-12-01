import axios from "axios"
import { url } from "../App"
import { useState } from "react"
import { toast } from "react-toastify";

const PasswordChange = () => {

  const [password,setPassword] = useState<string>('');
  const [newPassword,setNewPassword] = useState<string>('');

  const handleReset = async ()=>{
    await axios.patch(`${url}/auth/reset`,{
      password,
      newPassword,
    },{
      withCredentials:true
    }).then(()=>{
      toast.success("password updated ⚡");
      setPassword('')
      setNewPassword('')
    }).catch(()=>{
      toast.error("both password should be different 🫠");
    })
  }

  return (
    <div className="w-full  xl:w-[80%] h-120 xl:h-100 border-b border-gray-200  px-10 py-3 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Change password</h1>
      <p className="text-[0.8rem] text-gray-400">For your account's security, it's important to keep your password up to date. Use this feature to change your current password to a new, strong one. Make sure your new password is unique, difficult to guess, and not used for any other accounts. You will need to enter your current password to confirm your identity before updating to the new one.</p>
      <div className="flex flex-col gap-5" >
       <div className="flex flex-col gap-0.5">
         <label htmlFor="current">Current Password</label>
        <input type="password" value={password}  className="border border-gray-200 w-120 h-10 rounded-xl px-2 outline-none" id="current" placeholder="enter your current password" onChange={(e)=>setPassword(e.target.value)} />
       </div>
       <div className="flex flex-col gap-0.5">
         <label htmlFor="current">New Password</label>
        <input type="password" value={newPassword}  className="border border-gray-200 w-120 h-10 rounded-xl px-2 outline-none" id="new" placeholder="enter your new password" onChange={(e)=>setNewPassword(e.target.value)}/>
       </div>
      
      
        <button className="bg-black text-white rounded-2xl py-3 w-50 active:scale-95 cursor-pointer" onClick={handleReset}>Change password</button>
      </div>
      </div>
  )
}
export default PasswordChange