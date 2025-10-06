import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getChats  } from '../controllers/chat.controller.js';
const chatRouter = express.Router();

chatRouter.get(`/getchat/:id`,authMiddleware,getChats);



export default chatRouter;