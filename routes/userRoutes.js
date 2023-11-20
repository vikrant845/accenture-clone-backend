import express from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import User from '../models/user.model.js';
import { addUser, getUsers, jwtExpired } from '../controllers/userController.js';
import { login, protect, signUp } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/jwtExpired', jwtExpired);
router.post('/', signUp);

router.post('/login', login);

export { router as userRouter };