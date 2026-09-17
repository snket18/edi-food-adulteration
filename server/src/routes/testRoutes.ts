import { Router } from 'express';
import { createTest, captureSpectrum, analyzeTest, getTests, getTestById } from '../controllers/testController';

const router = Router();

// Test Lifecycle endpoints
router.post('/', createTest);
router.post('/:id/capture', captureSpectrum);
router.post('/:id/analyze', analyzeTest);

// Endpoints to fetch history
router.get('/', getTests);
router.get('/:id', getTestById);

export default router;
