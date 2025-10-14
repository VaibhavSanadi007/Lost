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

export const googleLogin = async (req: Request, res: Response) => {
 
  const googleUser = req.user as any;

  const { name, email, picture } = googleUser._json;
  let isUser = await userModel.findOne({ email });

  if (!isUser) {
    isUser = await userModel.create({
      username: name,
      name,
      email,
      dp: picture,
      password: "Google@123",
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
