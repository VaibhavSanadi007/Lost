import {  Request, Response } from "express";
import userModel from "../models/user.model.js";
import  { JwtPayload } from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
  createSession,
} from "../services/auth.service.js";


export interface myjwtpayload extends JwtPayload {
  id: number;
  username: string;
  email: string;
  role?: string;
  iat: number;
  exp: number;
}

export const githubLogin = async (req: Request, res: Response) => {
 
  const githubUser = req.user as any;

  const { name, login , email, avatar_url } = githubUser._json;

  let isUser = await userModel.findOne({ username:login });

  if (!isUser) {
    isUser = await userModel.create({
      username: login,
      name,
      email: `${login}@gmail.com`,
      dp: avatar_url,
      password: "Github@123",
    });
  }

  const session = await createSession(isUser._id, {
    ipAddress: req.clientIp,
    userAgent: req.headers[`user-agent`],
  });

   const accessToken = await createAccessToken({
      _id: isUser._id,
      username: isUser.username,
      email: isUser.email,
      sessionId: session._id,
    });
    const refreshToken = await createRefreshToken(session._id);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  return res.redirect(`${process.env.frontURL}/home`);
};
