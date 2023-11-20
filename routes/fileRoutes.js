import express from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express();

router.post('/', catchAsync(async (req, res, next) => {
  const { file } = req.body;
  let options = {}
  if (file.split('/')[0] === 'data:application') options.format = 'jpeg';

  const uploadedData = await cloudinary.uploader.upload(file, options);
  res.status(200).json({
    message: 'success',
    data: {
      uploadedData,
      file
    }
  });
}));

export default router;