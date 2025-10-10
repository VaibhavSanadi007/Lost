import { useDispatch } from "react-redux";
import { url } from "../App";
import axios from "axios";
import { addPost } from "../store/postSlice";

 const getFeed = async () => {
  const dispatch = useDispatch();
    const { data } = await axios.get(`${url}/post/feed`, {
      withCredentials: true,
    });
    dispatch(addPost(data.data));
  };

  export default getFeed;