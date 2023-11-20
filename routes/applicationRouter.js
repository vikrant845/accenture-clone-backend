import express from 'express';
import { addApplication, getApplications } from '../controllers/applicationController.js';
import { protect } from '../controllers/authController.js';

const router = express.Router();

router.get('/', getApplications);
router.post('/', protect, addApplication);

export default router;