import express from 'express';
const router = express.Router();
import {authRegister, authLogin, authLogOut, authReset ,authForgot, authDeleteAccount , authPrivacyAccount} from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { registerValidator , loginValidator , forgotValidator , resetValidator } from '../middlewares/auth.validator.js';

router.post('/register',registerValidator,authRegister);
router.post('/login',loginValidator,authLogin);
router.get('/logout',authMiddleware,authLogOut);
router.post('/forgot',forgotValidator,authMiddleware,authForgot);
router.patch('/reset',resetValidator,authMiddleware,authReset);
router.delete('/deleteuser',authMiddleware,authDeleteAccount);
router.patch('/privacy',authMiddleware,authPrivacyAccount);

export default router;

