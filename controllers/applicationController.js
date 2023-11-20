import Application from '../models/application.model.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getApplications = catchAsync(async (req, res, next) => {
  const applications = await Application.find();
  res.status(200).json({
    message: 'success',
    data: {
      applications
    }
  });
});

export const addApplication = catchAsync(async (req, res, next) => {
  const application = await Application.create(req.body);
  res.status(200).json({
    message: 'success',
    data: {
      application
    }
  });
});