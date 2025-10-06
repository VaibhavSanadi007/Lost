import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createComment, getComments , editComments, deleteComments} from '../controllers/comment.controller.js';
const commentRouter = express.Router();

commentRouter.post('/create/:postid',authMiddleware,createComment);
commentRouter.get('/fetch/:postid',authMiddleware,getComments);
commentRouter.patch('/update/:commentid',authMiddleware,editComments);
commentRouter.delete('/delete/:commentid',authMiddleware,deleteComments);

export default commentRouter;