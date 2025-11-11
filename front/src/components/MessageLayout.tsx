import MessageBox from "./MessageBox"
import Sidebar from "./Sidebar"

const MessageLayout = () => {
  return (
    <div className="h-full w-full ">
      <Sidebar/>
      <div className="md:p-15 lg:p-0  lg:pl-75 xl:pl-100 lg:pt-5   ">
      <MessageBox/>
      </div>
    </div>
  )
}
export default MessageLayout