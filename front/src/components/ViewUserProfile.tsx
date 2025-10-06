import Sidebar from "./Sidebar"
import UserProfile from "./UserProfile"
import UserProfilePosts from "./UserProfilePosts"

const ViewUserProfile = () => {

  return (
    <div className="w-full h-full xl:pl-70 xl:py-5  ">
      <Sidebar/>
      <UserProfile />
      <UserProfilePosts/>
    </div>
  )
}
export default ViewUserProfile