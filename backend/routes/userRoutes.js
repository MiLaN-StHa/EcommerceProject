import express from 'express';
import {loginUser,registerUser,adminLogin,getUserProfile,updateUserProfile} from '../controllers/userContoller.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/profile',getUserProfile)
userRouter.post('/update',updateUserProfile)

export default userRouter;
