import DeleteAccount from "./DeleteAccount";
import PasswordChange from "./PasswordChange"
import Privacy from "./Privacy";
import SettingsList from "./SettingsList"
import Sidebar from "./Sidebar"
import { useState } from "react";

const Settings = () => {
  const [settingmode,setSettingmode] = useState<string>('change');

  return (
    <div className="w-full h-full flex xl:gap-5 md:pl-70 lg:pl-80 xl:pl-100 xl:pt-20 xl:px-0 pt-15 px-5">
      <Sidebar/>
      <SettingsList setSettingmode={setSettingmode}/>
     { settingmode === 'change'?<PasswordChange/> : settingmode==='delete'? <DeleteAccount/> : <Privacy/> }
    </div>
  )
}
export default Settings