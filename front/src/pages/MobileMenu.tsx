import { useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../store/reduxStore";

const MobileMenu = () => {
  const userData = useSelector((item: RootState) => item.user);
  const navigate = useNavigate();
  const [menuFlag,setMenuFlag] = useState<boolean>(false);
  return (
    <div className="fixed bottom-10 right-5 bg-black text-white lg:hidden">
      {/* check */}
     {menuFlag && <div className="flex flex-col gap-3 w-40 py-2 md:w-60 md:py-5" onChange={(e)=>{e.stopPropagation()}}> 
        <nav className="text-end px-3 md:px-5 md:text-2xl" onClick={()=>setMenuFlag(false)}>X</nav>
        <button className="active:scale-90 duration-200 md:text-2xl" onClick={()=> navigate(`/home`)} >feed</button>
        <button className="active:scale-90 duration-200 md:text-2xl" onClick={()=>navigate(`/messagelist/${userData._id}`)}>friends</button>
        <button className="active:scale-90 duration-200 md:text-2xl" onClick={()=>navigate(`/explore`)}>explore</button>
        <button className="active:scale-90 duration-200 md:text-2xl" onClick={()=>navigate(`/profile/${userData._id}`)}>profile</button>
        <button className="active:scale-90 duration-200 md:text-2xl" onClick={()=>navigate(`/setting`)}>settings</button>
        <button className="active:scale-90 duration-200 md:text-2xl" onClick={()=>navigate(`/createpost`)}>create post</button>
      </div>}
      {
        !menuFlag && <div className="p-2 md:p-5"  onClick={()=>setMenuFlag(true)}>
          ---
        </div>
      }
      
    </div>
  )
}
export default MobileMenu