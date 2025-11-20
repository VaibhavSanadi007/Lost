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
import ChatAI from "../components/ChatAI"
import ProtectedRoute from "../custom_component/Protected_route"



const MainRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/signup" element={<SignUp/>} />
     <Route path="/home" element={<Home/>} />

<Route path="/messagelist/:userId" 
  element={<ProtectedRoute><MessageList/></ProtectedRoute>} 
/>

<Route path="/messagebox/:userId" 
  element={<ProtectedRoute><MessageLayout/></ProtectedRoute>} 
/>

<Route path="/profile/:userId" 
  element={<ProtectedRoute><Profile/></ProtectedRoute>} 
/>

<Route path="/createpost" 
  element={<ProtectedRoute><CreatePost/></ProtectedRoute>} 
/>

<Route path="/viewuser/:userId" 
  element={<ProtectedRoute><ViewUserProfile/></ProtectedRoute>} 
/>

<Route path="/explore" 
  element={<ProtectedRoute><Explore/></ProtectedRoute>} 
/>

<Route path="/setting" 
  element={<ProtectedRoute><Settings/></ProtectedRoute>} 
/>

<Route path="/ai" 
  element={<ProtectedRoute><ChatAI/></ProtectedRoute>} 
/>

    </Routes>
  )
}
export default MainRoutes