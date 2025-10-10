import { useNavigate } from "react-router-dom";
import type { ObjType } from "../store/userSlice";
import type { Dispatch, FC, SetStateAction } from "react";

type property = {
  setopenFollowers : Dispatch<SetStateAction<boolean>>;
  followData : ObjType[];
}

const ViewFollowers:FC<property> = ({setopenFollowers , followData}) => {
    const navigate = useNavigate();
  
  return (
   <>
   </>
  )
}
export default ViewFollowers
