import { Types } from "mongoose";
import sessionModel from "../models/Session.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model.js";
type IpObj = {
  ipAddress : string | undefined;
  userAgent: string | undefined;
}

type typeAcessToken = {
  _id : Types.ObjectId;
  username : string;
  email : string;
  sessionId : Types.ObjectId;
}


export interface myjwtpayload extends JwtPayload {
  sessionId: Types.ObjectId;
}


export const createSession = async (userId: Types.ObjectId  ,{ ipAddress, userAgent }:IpObj) => {
  const session = await sessionModel.create({
    userId,
    ipAddress,
    userAgent,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return session;
}

export const createAccessToken = async ({_id,username,email,sessionId}: typeAcessToken ) => {
  return jwt.sign({_id,username,email,sessionId},process.env.JWT_SECRET!,{expiresIn: `15m`});
}

export const createRefreshToken = async (sessionId : Types.ObjectId) => {
  return jwt.sign({sessionId},process.env.JWT_SECRET!,{expiresIn: `7d`});
}

export const findSessionById = async (sessionId:Types.ObjectId) => {
  const session = await sessionModel.findById(sessionId);
  return session;
}

export const refreshTokens = async (refreshToken:string)=>{
 try{ const decodedToken = jwt.verify( refreshToken , process.env.JWT_SECRET! ) as myjwtpayload;

  const currentSession = await findSessionById(decodedToken.sessionId); 

  if(!currentSession || !currentSession.isValid){
    throw new Error("Invalid session");
  }

  const user = await userModel.findById(currentSession.userId);
  if(!user){
    throw new Error("Invalid User");
  }

  const userInfo = {
    _id: user._id,
    username: user.username,
    email: user.email,
    sessionId: currentSession._id
  };

  const NewAccessToken = await createAccessToken(userInfo);
  const NewRefreshToken = await createRefreshToken(currentSession._id);

  return {
    NewAccessToken,
    NewRefreshToken,
    user:userInfo
  }

}catch(err){
  console.log(err)
}
}

export const clearUserSession = async (sessionId:Types.ObjectId) => {
   await sessionModel.findByIdAndDelete(sessionId);
}