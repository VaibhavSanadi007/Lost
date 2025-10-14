import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel, { IUser } from "../models/user.model.js";
import { refreshTokens } from "../services/auth.service.js";
import { Types } from "mongoose";

export interface myjwtpayload extends JwtPayload {
  id: number;
  username: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        username: string;
        email: string;
        sessionId: Types.ObjectId;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) {
      return next();
    }

    if (accessToken) {
      const Tokendata = jwt.verify( accessToken, process.env.JWT_SECRET! ) as myjwtpayload;
      const isUserExist = await userModel.findOne({
                $or: [{ _id: Tokendata._id }, { username: Tokendata.username }],
              });       
    if (!isUserExist) {
        return res.status(400).send("User is not in db");
      }
      req.user = isUserExist;
      return next();
    }

    if(refreshToken){
      try{
        const result = await refreshTokens(refreshToken); 

        if (!result) {
      throw new Error("Failed to refresh tokens");
        }

        const {NewAccessToken , NewRefreshToken , user } = result;
 
        req.user = user;

         res.cookie('access_token', NewAccessToken ,{
     httpOnly: true,
     secure: true,
     sameSite: "none",  
     maxAge: 15 * 60 * 1000,
   }
  )
    res.cookie('refresh_token', NewRefreshToken ,{
     httpOnly: true,
     secure: true,
     sameSite: "none",  
     maxAge: 7 * 24 * 60 * 60 * 1000,
   }
  );

  return next();

      }catch(err : unknown ){
        if(err instanceof Error){
          console.log(err.message);
        }else{
          console.log("unknown error",err);
        }
      }
    }
    
  return next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error });
  }
};

export default authMiddleware;
