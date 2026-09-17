import { Router } from 'express';
import { getMonitoringDashboard, getMapData } from '../controllers/monitoringController';

const router = Router();

// Endpoint to fetch the complete monitoring dashboard data
router.get('/dashboard', getMonitoringDashboard);

// Endpoint to fetch map data
router.get('/map', getMapData);

export default router;
