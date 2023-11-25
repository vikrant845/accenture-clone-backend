import 'dotenv/config';
import express from 'express';
import path from 'path';
import * as url from 'url';
import mongoose from 'mongoose';
import { errorController } from './controllers/errorController.js';
import { userRouter } from './routes/userRoutes.js';
import cookie from 'cookie-parser';
import cors from 'cors';
import jobRouter from './routes/jobRoutes.js';
import applicationRouter from './routes/applicationRouter.js';
import fileRouter from './routes/fileRoutes.js';
import { protect } from './controllers/authController.js';
import { v2 as cloudinary } from 'cloudinary';

const __fileName = url.fileURLToPath(import.meta.url);
const __dirName = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.use(express.json({ limit: '3mb' }));
app.use(express.static(path.join(__dirName, 'public')));
app.use(cookie());
app.use(cors());

const con = await mongoose.connect(process.env.ENVIRONMENT === 'production' ? process.env.MONGODB_DATABASE_URL : process.env.MONGODB_LOCAL_DATABASE_URL);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

app.use('/api/users', userRouter)
app.use('/api/jobs', jobRouter);
app.use('/api/application', applicationRouter);
app.use('/api/file_upload', protect, fileRouter);

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Welcome to accenture backend' });
});

app.use(errorController);

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${ process.env.PORT }`);
});