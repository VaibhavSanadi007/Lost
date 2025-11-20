import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel  from "../models/user.model.js";
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

export const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (accessToken) {
      try {
        const payload = jwt.verify(accessToken, process.env.JWT_SECRET! ) as unknown  as myjwtpayload ;

        const user = await userModel.findById(payload._id);
        if (!user) return res.status(400).send("User does not exist");

        req.user = user;
        return next();
      } catch (err) {}
    }

    if (refreshToken) {
      try {
        const result = await refreshTokens(refreshToken);
        if (!result) throw new Error("Refresh failed");

        const { NewAccessToken, NewRefreshToken, user } = result;

        res.cookie("access_token", NewAccessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 15 * 60 * 1000,
        });
        res.cookie("refresh_token", NewRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        req.user = user;
        return next();
      } catch (err) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export default authMiddleware;