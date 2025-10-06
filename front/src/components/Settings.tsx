import SettingsList from "./SettingsList"
import Sidebar from "./Sidebar"

const Settings = () => {
  return (
    <div className="w-full h-full md:pl-70 lg:pl-80 xl:pl-100 xl:pt-20 xl:px-0 pt-15 px-5">
      <Sidebar/>
      <SettingsList/>
    </div>
  )
}
export default Settings