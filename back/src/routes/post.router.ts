import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createPost , deletePost, editPost, getuserPosts, LikePost, UnLikePost, usersLikePost,getFeed , getCaption } from '../controllers/post.controller.js';
import upload from '../services/multer.services.js';

const postRouter = express.Router();

postRouter.post('/create',authMiddleware, upload.single('file'),createPost);
postRouter.delete('/delete/:id',authMiddleware,deletePost);
postRouter.patch('/update/:id',authMiddleware,editPost);

postRouter.post('/like',authMiddleware,LikePost);
postRouter.post('/unlike',authMiddleware,UnLikePost);

postRouter.get('/likes/:id',authMiddleware,usersLikePost);
postRouter.get('/userposts/:id',authMiddleware,getuserPosts);

postRouter.get('/feed',authMiddleware,getFeed);


postRouter.post('/getcaption',authMiddleware,upload.single('file'),getCaption);

// postRouter.get('/getpost/:id',authMiddleware)

export default postRouter;