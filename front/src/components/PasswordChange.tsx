const PasswordChange = () => {
  return (
    <div className="w-1/2 h-130 border border-gray-200 rounded-2xl px-10 py-5 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Change password</h1>
      <p className="text-[0.8rem] text-gray-400">For your account's security, it's important to keep your password up to date. Use this feature to change your current password to a new, strong one. Make sure your new password is unique, difficult to guess, and not used for any other accounts. You will need to enter your current password to confirm your identity before updating to the new one.</p>
      <div className="flex flex-col gap-5" >
       <div className="flex flex-col gap-0.5">
         <label htmlFor="current">Current Password</label>
        <input type="password"  className="border border-gray-200 h-10 rounded-xl px-2 outline-none" id="current" placeholder="enter your current password" />
       </div>
       <div className="flex flex-col gap-0.5">
         <label htmlFor="current">New Password</label>
        <input type="password"  className="border border-gray-200 h-10 rounded-xl px-2 outline-none" id="new" placeholder="enter your new password"/>
       </div>
       <div className="flex flex-col gap-0.5">
         <label htmlFor="current">Confirm Password</label>
        <input type="password"  className="border border-gray-200 h-10 rounded-xl px-2 outline-none" id="confirm" placeholder="enter your confirm password"/>
       </div>
      
        <button className="bg-black text-white rounded-2xl py-3 active:scale-95 cursor-pointer">Change password</button>
      </div>
      </div>
  )
}
export default PasswordChange