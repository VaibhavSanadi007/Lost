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
import compression from 'compression';
import storyRouter from './routes/story.routers.js';

import session from 'express-session';
import requestIp from 'request-ip';

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import { googleLogin } from "./controllers/google.controller.js";
import { githubLogin } from "./controllers/github.controller.js";

const port = process.env.PORT || 8000;
import MongoStore from "connect-mongo";
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: "too many attempts plz try again later",
  standardHeaders: true,
legacyHeaders: false,
});

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(session({
  secret: `my-secret`,
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
}))
app.use(helmet());
app.use(
  cors({
    origin: process.env.frontURL ,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(requestIp.mw());

app.use(limiter);
app.use(compression({
  level:6,
  threshold:10*100,
  filter:(req,res)=>{
    if(req.headers[`x-no-compression`]){
      return false;
    }
    return compression.filter(req,res);
  },
}))
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
      callbackURL: `${process.env.callbackURL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      // Here, you would typically find or create a user in your database
      // For this example, we'll just return the profile
      return done(null, profile);
    }
  )
);

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: `${process.env.callbackURL}/auth/github/callback`
  },
  function(accessToken:any, refreshToken:any, profile:any, done:any) {
      return done(null , profile);
  }
));

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
  passport.authenticate("google",{session: false}),
  googleLogin
);

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' , session: false }),
  githubLogin);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter); 
app.use("/comment", commentRouter);
app.use("/msg", chatRouter);
app.use("/story", storyRouter);

const httpServer = createServer(app);
socketServer(httpServer);

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log("Server is running at port 3000");
  });
});
export default app;
