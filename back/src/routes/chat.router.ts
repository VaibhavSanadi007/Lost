import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getAiChats, getChats  } from '../controllers/chat.controller.js';
const chatRouter = express.Router();

chatRouter.get(`/getchat/:id`,authMiddleware,getChats);
chatRouter.get(`/aichat`,authMiddleware,getAiChats);


export default chatRouter;