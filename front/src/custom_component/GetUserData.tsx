import axios from "axios"
import { url } from "../App"
import { useDispatch } from "react-redux";
import { addUser } from "../store/userSlice";
import { useEffect } from "react";


const getUserData = () => {
  const dispatch = useDispatch();

  useEffect(()=>{

    let fetchData = async()=>{
      const {data} = await axios.get(`${url}/user/me`,{withCredentials:true});
      dispatch(addUser(data.data));
    }
    fetchData();
  },[]);

}

export default getUserData;