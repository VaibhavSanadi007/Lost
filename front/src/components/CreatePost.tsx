import PostCreateCard from "./PostCreateCard"
import Sidebar from "./Sidebar"
// import ViewPostCreateCard from "./ViewPostCreateCard"

const CreatePost = () => {
  return (
    <div className="h-full w-full md:pl-70 lg:pl-80 xl:pl-100  ">
      <Sidebar/>
      <div className="xl:py-10 py-5">
      <h1 className="text-gray-500 text-3xl xl:text-4xl xl:mb-1 ">Create Post</h1>
      <p className="text-gray-700 xl:mb-5 mb-3 ">share your thoughts with the world</p>
      
      <div className=" flex xl:w-full xl:gap-3 px-2">
      <PostCreateCard/>

      {/* <ViewPostCreateCard  /> */}

      </div>

      </div>
    </div>
  )
}
export default CreatePost