import { Router } from 'express';
import { getReportData } from '../controllers/reportController';

const router = Router();

// Endpoint to fetch report data
router.get('/data', getReportData);

export default router;
