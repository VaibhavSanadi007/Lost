import express from 'express';
const router = express.Router();
import {authRegister, authLogin, authLogOut, authReset ,authForgot} from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { registerValidator,loginValidator , forgotValidator , resetValidator } from '../middlewares/auth.validator.js';

router.post('/register',registerValidator,authRegister);
router.post('/login',loginValidator,authLogin);
router.get('/logout',authMiddleware,authLogOut);
router.post('/forgot',forgotValidator,authForgot);
router.post('/reset',resetValidator,authMiddleware,authReset);

export default router;

