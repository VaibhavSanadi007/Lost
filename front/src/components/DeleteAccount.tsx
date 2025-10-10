import { AiOutlineUserDelete } from "react-icons/ai";
import { TbUserCancel } from "react-icons/tb";
const DeleteAccount = () => {
  return (
    <div className="w-1/2 h-fit border border-gray-200 rounded-2xl px-10 py-5 flex flex-col gap-5">
      <h1 className="text-3xl font-semibold">Delete account</h1>
      <p className="text-[0.8rem] text-gray-400">Are you sure you want to delete your account? This will permanently remove your profile, personal information, posts, settings, and any other data associated with your account. Once deleted, this action cannot be undone, and you will lose access to all your content. We're sad to see you go! If you just want a break, consider deactivating your account temporarily instead.</p>
     
      <div className="flex gap-4 w-full">
        <button className="bg-black text-white rounded-xl py-3 active:scale-95 cursor-pointer w-40 flex items-center justify-center gap-2 ">
          <TbUserCancel />
          Cancel
          </button>
        <button className="bg-red-400 text-white rounded-xl py-3 active:scale-95 cursor-pointer w-40 flex items-center justify-center gap-2 ">
          <AiOutlineUserDelete />
          Yes, delete
          </button>
      </div>
      </div>
  )
}
export default DeleteAccount