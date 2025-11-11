import { RiLockPasswordLine , RiDeleteBin5Line } from "react-icons/ri";
import {  type FC } from "react";

type property = {
 setSettingmode : React.Dispatch<React.SetStateAction<string>>;
}

const SettingsList:FC<property> = ({setSettingmode}) => {

  

  return (
         <nav className="md:w-[50%] h-fit xl:w-[30%] bg-black backdrop-blur-2xl text-white rounded-xl overflow-hidden xl:pb-2 xl:pt-2 xl:px-1 py-4 px-2 cursor-pointer flex flex-col xl:gap-1.5 gap-2 md:gap-3">
              <div className="flex items-center xl:px-2 xl:py-1.5 xl:gap-2 md:gap-2 rounded-xl hover:bg-white/10"                                onClick={()=>setSettingmode('change')} >
              <RiLockPasswordLine />
              <h1 className="">Change password</h1>
              </div>
              <div className="flex items-center xl:px-2  xl:py-1.5 xl:gap-2 md:gap-2 rounded-xl hover:bg-white/10" onClick={()=>setSettingmode('delete')} >
              <RiDeleteBin5Line />
              <h1 className="">Delete account</h1>
              </div>
            </nav>
  )
}
export default SettingsList