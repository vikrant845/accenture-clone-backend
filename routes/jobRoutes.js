import express from 'express';
import { addJob, getAllJobs, getJobDetails, searchJob } from '../controllers/jobController.js';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:jobId', getJobDetails);
router.get('/search/:query', searchJob);

router.post('/', addJob);

export default router;