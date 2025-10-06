import express from 'express';
import { getUserData, updateUserData , deleteUserData, followUser, UnfollowUser , getfollowers, getfollowing , getUser, getRecommendFriends, searchUser } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../services/multer.services.js';
const router = express.Router();

router.get('/me',authMiddleware, getUser);


router.get('/recommend',authMiddleware,getRecommendFriends);

router.get('/search',authMiddleware,searchUser)


router.get('/:id',authMiddleware,getUserData);
router.patch('/:id',authMiddleware,upload.single("file"),updateUserData);
router.delete('/:id',authMiddleware,deleteUserData);

//follow
router.post('/:id/follow',authMiddleware,followUser);
router.delete('/:id/unfollow',authMiddleware,UnfollowUser);

//get followers and following
router.get('/:id/followers',authMiddleware,getfollowers);
router.get('/:id/following',authMiddleware,getfollowing);


//search users

//block and unblock feature under construction

export default router;