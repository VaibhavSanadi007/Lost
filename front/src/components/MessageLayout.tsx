import MessageBox from "./MessageBox"
import Sidebar from "./Sidebar"

const MessageLayout = () => {
  return (
    <div className="h-full w-full ">
      <Sidebar/>
      <div className="md:pl-70 lg:pl-90 xl:pl-130 lg:pt-5 xl:pt-5 ">
      <MessageBox/>
      </div>
    </div>
  )
}
export default MessageLayout