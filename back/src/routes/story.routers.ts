import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { addStoryFile, addStorytext, deleteStory, getFeedStories } from '../controllers/story.controller.js';
import upload from '../services/multer.services.js';
const router = express.Router();

router.post(`/addfile`,authMiddleware,upload.single('file'),addStoryFile);
router.post(`/addtext`,authMiddleware,addStorytext);
router.get(`/getStory`,authMiddleware,getFeedStories); //logic improve karna hoga
router.delete(`/deleteStory`,authMiddleware,deleteStory);

export default router;