import User from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { createJWT } from "./userController.js";
import jwt from 'jsonwebtoken';

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new Error('Email or Password not entered'));

  const user = await User.findOne({ email }).select('+password').populate('applications', '_id job createdAt updatedAt -user');
  if (!user || !await user.correctPassword(password, user.password)) return next(new Error('Please enter correct email and password.'));

  const token = await createJWT({ id: user._id });
  res.cookie('jwt', token, { expires: new Date(Date.now() + (1 * 60 * 1000)), httpOnly: true, secure: true });

  user.password = undefined;

  res.status(200).json({
    message: 'success',
    data: {
      user,
      token
    }
  });
})

export const signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = await createJWT({ id: user._id });

  res.cookie('jwt', token, { expires: new Date(Date.now() + 1 * 60 * 1000), httpOnly: true, secure: true });

  res.status(201).json({
    message: 'success',
    data: {
      token,
      user
    }
  });
});

export const protect = catchAsync(async (req, res, next) => {
  let token = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token) return next(new Error('Unauthorized. Please login to continue'));

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(err);
      resolve(decoded);
    });
  })

  const user = await User.findById(decoded.id);
  if (!user) next(new Error('Sorry this token doesnt belong to you. Please login or sign up to continue.'));

  if (user.passwordChanged(decoded.iat)) next(new Error('Sorry Password Changed. Please login again'));

  req.user = user;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new Error('Sorry this feature is not available to you.'));
    next();
  }
}

export const updatePassword = catchAsync(async (req, res, next) => {
  const updateDetails = req.body;

  const user = await User.findById(req.user._id);
  if (!user.correctPassword(updateDetails.currentPassword, user.password)) return next(new Error('Sorry your current password is wrong'));
  user.password = updateDetails.password;
  user.confirmPassword = updateDetails.confirmPassword;
  await user.save();

  const token = await createJWT({ id: req.user._id });
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 1 * 60 * 1000),
    httpOnly: true,
    secure: true
  });

  res.status(200).json({
    message: 'success',
    token
  });
})