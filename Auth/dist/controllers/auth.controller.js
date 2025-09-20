import jwt from "jsonwebtoken";
import prisma from "../databases/prisma.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;
export const authRegister = async (req, res) => {
    const { username, email, name, password, description, tags, role } = req.body;
    const isUserExist = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });
    if (isUserExist) {
        return res
            .status(409)
            .json({ message: "Username or email already exist in db" });
    }
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
        data: {
            username,
            email,
            name,
            password: hashPassword,
            description,
            tags,
            role,
        },
    });
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
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
export const authLogin = async (req, res) => {
    const { username, email, password } = req.body;
    const isUser = await prisma.user.findFirst({
        where: {
            OR: [{ username }, { email }]
        }
    });
    if (!isUser) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }
    const checkPassword = await bcrypt.compare(password, isUser.password);
    console.log(password, isUser.password);
    if (!checkPassword) {
        return res.status(401).json({ message: "p invalid credentials" });
    }
    const token = jwt.sign({
        id: isUser.id,
        username: isUser.username,
        email: isUser.email,
        role: isUser.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        message: "Login Successfull",
        data: isUser,
    });
};
export const authLogOut = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.status(200).json({
        message: "Logout successfull",
    });
};
export const authReset = async (req, res) => {
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
    const userPass = await prisma.user.findFirst({
        where: {
            OR: [{ id: req.user?.id }, { username: req.user?.username }]
        },
        select: {
            password: true,
        }
    });
    const isUserPassValid = await bcrypt.compare(password, userPass?.password);
    if (!isUserPassValid) {
        res.status(400).json({ message: "password is invalid" });
    }
    const hashPassword = await bcrypt.hash(confirmPassword, saltRounds);
    const UpdatePassword = await prisma.user.update({
        where: {
            id: req.user?.id
        },
        data: {
            password: hashPassword,
        }
    });
    res.status(200).json({
        "message": "password updated successfully",
        data: UpdatePassword
    });
};
export const authForgot = async (req, res) => {
    const { email, newpassword } = req.body;
    const isUsersEmailExist = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!isUsersEmailExist) {
        res.status(500).json('user not in db');
    }
    const hashPassword = await bcrypt.hash(newpassword, saltRounds);
    const UpdatePassword = await prisma.user.update({
        where: {
            id: isUsersEmailExist?.id
        },
        data: {
            password: hashPassword,
        }
    });
    res.status(200).json({
        "message": "password updated successfully",
        data: UpdatePassword
    });
};
