import { FaArrowLeftLong } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { FaRegEye , FaEyeSlash } from "react-icons/fa";
import { DiMysql } from "react-icons/di";

import axios from "axios";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../store/userSlice";
import { toast } from "react-toastify";

import { url } from "../../App";

const SignIn = () => {
  const navigate = useNavigate();
  const disptach = useDispatch();

  const [openEye , setOpenEye] = useState(false);

  const [email, setemail] = useState<string>("");
  const [password, setpassword] = useState<string>("");

    const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        `${url}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      navigate(`/home`);
      disptach(addUser(data.data));
      toast.success("Welcome Back!!")
 
    } catch (err:any) {
      console.log("Error :",err);
      toast.error(err.response.data.message)
    }
  };

  return (
    <div className="h-full w-full bg-white px-5 md:px-20  xl:px-25 ">
      {/* navbar  create account likne ke lyie*/}
      <div className="w-full h-10 lg:h-15  border-b border-b-gray-200 flex items-center justify-between ">
        <div className="flex items-center gap-0.5  xl:gap-1.5 cursor-pointer" onClick={()=>navigate(-1)}>
          <FaArrowLeftLong size={13} className="text-gray-400" />
          <span className="text-gray-400 text-sm" >Back</span>
        </div>

        <h1>Welcome back</h1>
      </div>

      <div className="w-full h-30 xl:h-30   flex items-center justify-center ">
        <h1 className="text-3xl font-semibold xl:ml-5 flex items-center"><DiMysql />LOST</h1>
      </div>

      {/* main content begins */}

      <div className="w-full xl:h-100  xl:px-25 lg:h-70  lg:px-20 lg:flex items-center justify-center  xl:gap-5">
        {/* mera login */}

        <div className="w-full xl:h-full xl:w-70 lg:w-70 flex flex-col items-center justify-center gap-2 md:gap-5 xl:gap-6 ">
          <h1 className="text-center text-[1.3rem] font-semibold">Log in</h1>

          <div className="w-full flex flex-col">
            <label htmlFor="Email">Email address</label>
            <input
              type="text"
              id="Email"
              className="outline-none border border-gray-200 rounded h-10  xl:h-10 xl:w-full px-1 xl:px-1.5"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>

          <div className="w-full  flex flex-col">

          <div className="flex items-end justify-between ">
            <label htmlFor="Password">Password</label>

          <div className="flex items-center xl:gap-2" onClick={()=>setOpenEye(!openEye)}>
            {openEye ? <FaRegEye size={13} className="text-gray-400"  /> :
            <FaEyeSlash size={13} className="text-gray-400" />}
            <h1 className="text-gray-400 text-sm cursor-pointer ">Hide</h1>
          </div>

          </div>
          <input
              type={openEye ? "text": "Password"}
            id="Password"
            className="outline-none border border-gray-200 rounded h-10 xl:h-10 xl:w-full px-1 xl:px-1.5"
            onChange={(e) => setpassword(e.target.value)}
          />

          </div>

          <button className="active:scale-95 text-center rounded-2xl h-10  xl:h-10 w-full bg-black text-white cursor-pointer"
          onClick={()=>{
            handleLogin()
            } }>
            Log in
          </button>
        </div>

        {/* center of attraction */}

        <div className="h-10 md:h-20 xl:w-10 xl:h-full flex xl:flex-col items-center justify-center gap-6  xl:gap-4 ">

        <div className="w-full h-1 border-t  xl:w-1 xl:h-full xl:border-l border-gray-300" />
        <h1 className="xl:text-sm ">OR</h1>
        <div className="w-full h-0.5 border-t  xl:w-1 xl:h-full border-l border-gray-300" />

        </div>

        {/* google ka login */}

        <div className="flex flex-col gap-4 xl:gap-5">

          <button className="cursor-pointer active:scale-95 border h-10  xl:h-10 lg:w-60  rounded-2xl flex items-center justify-center lg:gap-2 xl:gap-3">
            <FcGoogle size={25} />
            Continue with Google
          </button>
          <button className="cursor-pointer active:scale-95 border h-10 xl:h-10 xl:w-60 rounded-2xl flex items-center justify-center xl:gap-3">
            <FaGithub size={25} />
            Continue with Github
          </button>

        </div>
      </div>

      {/* main content ends */}

      {/* footer begins */}

      <footer className="w-full h-30 md:h-50  xl:h-30 xl:px-25 flex flex-col items-center justify-center xl:gap-5">
        <h1 className="text-sm font-semibold underline cursor-pointer active:scale-95 xl:ml-5 " onClick={()=>navigate('/signup')} >Can't log in</h1>
       <div className="flex flex-col items-center">
         <h1 className='text-[0.7rem] xl:ml-5'>Secure Login with reCaptcha subject to </h1>
        <h1 className='text-[0.7rem] xl:ml-5'>Google <span className="text-[0.8rem] underline">Terms & Privacy</span></h1>
       </div>
      </footer>

      {/* footer ends */}

    </div>
  );
};
export default SignIn;
