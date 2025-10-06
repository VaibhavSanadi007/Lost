import { Route, Routes } from "react-router-dom"
import Home from "../components/Home"
import MessageList from "../components/MessageList"
import Profile from "../components/Profile"
import CreatePost from "../components/CreatePost"
import MessageLayout from "../components/MessageLayout"
import ViewUserProfile from "../components/ViewUserProfile"
import Explore from "../components/Explore"
import SignIn from "../components/AuthPage/SignIn"
import SignUp from "../components/AuthPage/SignUp"
import Settings from "../components/Settings"


const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/home" element={<Home/>} />
      <Route path="/messagelist/:userId" element={<MessageList/>} />
      <Route path="/messagebox/:userId" element={<MessageLayout/>} />
      <Route path="/profile/:userId" element={<Profile/>} />
      <Route path="/createpost" element={<CreatePost/>} />
      <Route path="/viewuser/:userId" element={<ViewUserProfile/>} />
      <Route path="/explore" element={<Explore/>} />
      <Route path="/setting" element={<Settings/>} />
    </Routes>
  )
}
export default MainRoutes