import User from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import jwt from 'jsonwebtoken';

export function createJWT(data) {
  return new Promise((resolve, reject) => {
    let token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    resolve(token);
  })
}

export const addUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({ user });
})

export const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().populate('applications', '_id -user');
  res.status(200).json(users);
});

export const jwtExpired = (req, res, next) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.status(200).json({
    expired: decoded.exp < Date.now() / 1000,
    exp: decoded.exp,
    date: Date.now() / 1000
  });
};