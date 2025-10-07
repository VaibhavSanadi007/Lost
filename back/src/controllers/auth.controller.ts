import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import userModel from "../models/user.model.js";

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

  const user = await userModel.create({
    username,
    email,
    password: hashPassword,
   });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    message: "User Created Successfully",
    data: user,
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

  const token = jwt.sign(
    {
      id: isUser._id,
      username: isUser.username,
      email: isUser.email,
      role: isUser.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,          // true because Render uses HTTPS
  sameSite: "none",      // ✅ allows cross-site cookie sharing
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

  return res.status(200).json({
    message: "Login Successful",
    data: isUser,
  });
};

export const authLogOut = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
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
    $or: [{ _id: req.user?.id }, { username: req.user?.username }],
  }).select("password");

  const isUserPassValid = await bcrypt.compare(password, userPass?.password as string);

  if (!isUserPassValid) {
    return res.status(400).json({ message: "password is invalid" });
  }

  const hashPassword = await bcrypt.hash(confirmPassword, saltRounds);

  const UpdatePassword = await userModel.findByIdAndUpdate(
    req.user?.id,
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

