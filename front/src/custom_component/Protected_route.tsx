// ProtectedRoute.jsx
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store/reduxStore";

type ProtectedRouteProps = {
  children: ReactNode;
};
export default function ProtectedRoute({ children}: ProtectedRouteProps ) {
  const userData = useSelector((item:RootState) => item.user);

  if (!userData._id) {
    return <Navigate to="/" />;
  }

  return children;
}
