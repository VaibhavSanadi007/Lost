import DeleteAccount from "./DeleteAccount";
import PasswordChange from "./PasswordChange"
// import Privacy from "./Privacy";
import Sidebar from "./Sidebar"

const Settings = () => {

  return (
    <div className="w-full h-full flex  xl:gap-5  lg:pl-80 xl:pl-80 xl:pt-20 xl:px-0 py-15 px-5">
      <Sidebar/>
      <div className=" flex flex-col items-center gap-5 ">
     <PasswordChange/>  
     <DeleteAccount/>  
     {/* <Privacy/>  */}
      </div>
    </div>
  )
}
export default Settings