import { catchAsync } from '../utils/catchAsync.js';
import Job from '../models/job.model.js';

export const getAllJobs = catchAsync(async (req, res, next) => {
  const page = req.query.page ? req.query.page : 1
  const limit = req.query.limit ? req.query.limit : 10;
  const results = (page - 1) * limit;
  const documentCount = await Job.count();
  if (results > documentCount) next(new Error('Not enough documents'));
  const jobs = await Job.find().skip(results).limit(limit);
  res.status(200).json({
    message: 'success',
    data: {
      count: jobs.length,
      jobs
    }
  });
})

export const addJob = catchAsync(async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(200).json({
    message: 'success',
    job
  });
});

export const getJobDetails = catchAsync(async (req, res, next) => {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  res.status(200).json({
    message: 'success',
    data: {
      job
    }
  });
});

export const searchJob = catchAsync(async (req, res, next) => {
  const { query } = req.params;
  const regex = new RegExp(`${ query }`, 'i');
  if (query === 'all') {
    const job = await Job.find();
    res.status(200).json({
      message: 'success',
      data: {
        job
      }
    });
  }
  const job = await Job.aggregate([
    {
      $addFields: {
        searchField: { $concat: [ '$name', '$city', '$country' ] }
      }
    },
    {
      $match: {
        searchField: { $regex: regex }
      }
    },
    {
      $unset: 'searchField'
    }
  ]);
  if (job.length > 0) {
    res.status(200).json({
      message: 'success',
      data: {
        job
      }
    });
  } else {
    res.status(404).json({
      message: 'failure'
    });
  }
});