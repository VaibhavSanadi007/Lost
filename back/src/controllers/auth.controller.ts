import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import userModel from "../models/user.model.js";
import { clearUserSession, createAccessToken, createRefreshToken, createSession } from "../services/auth.service.js";
import commentModel from "../models/comment.model.js";
import followModel from "../models/follow.model.js";
import storyModel from "../models/story.model.js";
import chatModel from "../models/socket.model.js";
import postModel from "../models/post.model.js";
import imagekit from "../services/imagekit.services.js";


export const authRegister = async (req: Request, res: Response) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExist) {
    return res
      .status(409)
      .json({ message: "Username or email already exist in db" });
  }

  const hashPassword = await bcrypt.hash(password, saltRounds);

  const isUser = await userModel.create({
    username,
    email,
    password: hashPassword,
   });

    const session = await createSession(isUser._id,{
    ipAddress: req.clientIp,
    userAgent: req.headers[`user-agent`],
  })

  const accessToken = await createAccessToken({_id: isUser._id,username: isUser.username ,email: isUser.email , sessionId : session._id })
  const refreshToken = await createRefreshToken(session._id );

    res.cookie('access_token', accessToken ,{
     httpOnly: true,
     secure: true,
     sameSite: "none",  
     maxAge: 15 * 60 * 1000,
   }
  )
    res.cookie('refresh_token', refreshToken ,{
     httpOnly: true,
     secure: true,
     sameSite: "none",  
     maxAge: 7 * 24 * 60 * 60 * 1000,
   }
  )

  res.status(201).json({
    message: "User Created Successfully",
    data: isUser,
  });
};

export const authLogin = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const isUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (!isUser) {
    return res.status(401).json({ message: "Invalid Credentials" });
  }

  const checkPassword = await bcrypt.compare(password, isUser.password!);

  if (!checkPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const session = await createSession(isUser._id,{
    ipAddress: req.clientIp,
    userAgent: req.headers[`user-agent`],
  })

  const accessToken = await createAccessToken({_id: isUser._id,username: isUser.username ,email: isUser.email , sessionId : session._id })
  const refreshToken = await createRefreshToken(session._id );

    res.cookie('access_token', accessToken ,{
     httpOnly: true,
     secure: true,
     sameSite: "none",  
     maxAge: 15 * 60 * 1000,
   }
  )
    res.cookie('refresh_token', refreshToken ,{
     httpOnly: true,
     secure: true,
     sameSite: "none",  
     maxAge: 7 * 24 * 60 * 60 * 1000,
   }
  )

  return res.status(200).json({
    message: "Login Successful",
    data: isUser,
  });
};

export const authLogOut = async (req: Request, res: Response) => {

  await clearUserSession(req.user?.sessionId!);

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",  
    expires: new Date(0),
  });
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",  
    expires: new Date(0),
  });

  return res.status(200).json({
    message: "Logout successfull",
  });
};

export const authReset = async (req: Request, res: Response) => {
  const { password, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "newpassword and confirmpassword are different" });
  }

  if (password == confirmPassword) {
    return res
      .status(400)
      .json({ message: "password and confirmpassword should be different" });
  }

  const userPass = await userModel.findOne({
    $or: [{ _id: req.user?._id }, { username: req.user?.username }],
  }).select("password");

  const isUserPassValid = await bcrypt.compare(password, userPass?.password as string);

  if (!isUserPassValid) {
    return res.status(400).json({ message: "password is invalid" });
  }

  const hashPassword = await bcrypt.hash(confirmPassword, saltRounds);

  const UpdatePassword = await userModel.findByIdAndUpdate(
    req.user?._id,
    { password: hashPassword },
    { new: true }
  );

  res.status(200).json({
    message: "password updated successfully",
    data: UpdatePassword
  });
};

export const authForgot = async (req: Request, res: Response) => {
  const { email, newpassword } = req.body;

  const isUsersEmailExist = await userModel.findOne({ email });

  if (!isUsersEmailExist) {
    return res.status(500).json("user not in db");
  }

  const hashPassword = await bcrypt.hash(newpassword, saltRounds);

  const UpdatePassword = await userModel.findByIdAndUpdate(
    isUsersEmailExist._id,
    { password: hashPassword },
    { new: true }
  );

  res.status(200).json({
    message: "password updated successfully",
    data: UpdatePassword
  });
};

export const authDeleteAccount = async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const postOfUser = await postModel.find({postUserId:userId}).select(`postId`);

  if(postOfUser.length>0){
    const postArr = postOfUser.map((item)=>{
      return item.postId;
    });
  
   const response = await imagekit.bulkDeleteFiles(postArr);
    console.log(response);
  }

  await userModel.findByIdAndDelete(userId);
  await commentModel.deleteMany({
    commentUserId: userId
  });
  await followModel.deleteMany({$or:[
    {followerId:userId},
    {followingId:userId}
  ]});
  await storyModel.deleteMany({
    ownerId: userId
  });
  await chatModel.deleteMany({
    $or:[
      {senderId:userId},
      {receiverId:userId}
    ]
  });
  await postModel.deleteMany({
    postUserId: userId
  });

  res.status(200).json({
    message: "account deleted successfully",
  });
};

export const authPrivacyAccount = async (req: Request, res: Response) => {
  const {privateMode} = req.body;
  const userId = req.user?._id;
  await userModel.findByIdAndUpdate(userId,{privateMode});

  res.status(200).json({
    message: "account privacy updated successfully",
  });
};

