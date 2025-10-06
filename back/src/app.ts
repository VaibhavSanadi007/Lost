import "dotenv/config";
import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cors from "cors";
import cookieparser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.routers.js";
import userRouter from "./routes/user.routers.js";
import connectDB from "./databases/db.js";
import postRouter from "./routes/post.router.js";
import commentRouter from "./routes/comment.routers.js";
import { socketServer } from "./services/socket.services.js";
import chatRouter from "./routes/chat.router.js";
// import nodemailer from 'nodemailer';
// const limiter = rateLimit({
//    windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "too many attempts plz try again later",
// });

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "./models/user.model.js";
import jwt from "jsonwebtoken";

const port = process.env.PORT || 8000;

const allowedOrigin: string = `http://localhost:5173`;
const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
// app.use(limiter);

// const transporter = nodemailer.createTransport({
//   host: `smtp.gmail.com`,
//   port: 587,
//   secure: false,
//   auth: {
//     user: 'vaibhavbhausanadi007@gmail.com',
//     pass: process.env.EMAIL_PASS,
//   }
// })

// Configure Passport to use Google OAuth 2.0 strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you would typically find or create a user in your database
      // For this example, we'll just return the profile
      return done(null, profile);
    }
  )
);

// Route to initiate Google OAuth flow
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Callback route that Google will redirect to after authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    console.log("google");
    const googleUser = req.user as any;

    const { name, email, picture } = googleUser._json;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        username: name,
        name,
        email,
        dp: picture,
        password: "Google@123",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

   return res.redirect(`http://localhost:5173/home?token=${token}`);
  }
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/msg", chatRouter);

const httpServer = createServer(app);
socketServer(httpServer);

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log("Server is running at port 3000");
  });
});
export default app;
