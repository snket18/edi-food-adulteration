import { Router } from 'express';
import { analyzeTest, saveTest, getTests, getTestById } from '../controllers/testController';

const router = Router();

// Endpoint to run ML analysis on captured spectrum
router.post('/analyze', analyzeTest);

// Endpoint to save a finalized test result
router.post('/', saveTest);

// Endpoints to fetch history
router.get('/', getTests);
router.get('/:id', getTestById);

export default router;
