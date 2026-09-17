import type { Request, Response } from 'express';
import { analyzeSpectrum } from '../services/mlService';
import { prisma } from '../utils/prisma';

// Generate ID: SC-YYYYMMDD-XXX
const generateTestId = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `SC-${dateStr}-${randomSuffix}`;
};

export const createTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sampleType } = req.body;
    const userId = (req as any).user.userId;
    const testId = await generateTestId();

    try {
      const test = await prisma.test.create({
        data: {
          id: testId,
          userId,
          sampleType: sampleType || 'MILK',
          status: 'CREATED'
        }
      });
      res.status(201).json({ success: true, data: test });
    } catch (dbError) {
      console.warn('Database save failed. Returning mock test creation.');
      res.status(201).json({
        success: true,
        data: { id: testId, userId, sampleType: sampleType || 'MILK', status: 'CREATED' },
        warning: 'Demo Mode'
      });
    }
  } catch (error) {
    console.error('Create test error:', error);
    res.status(500).json({ success: false, message: 'Failed to create test' });
  }
};

export const captureSpectrum = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { mockScenario } = req.body;
    const userId = (req as any).user.userId;

    try {
      // In production, we'd verify ownership: await prisma.test.findFirst({where: {id, userId}})
      const test = await prisma.test.update({
        where: { id: id as string },
        data: {
          status: 'CAPTURED',
          spectrum: {
            create: {
              imageUrl: '/placeholder.jpg',
              metadata: mockScenario ? { mockScenario } : {}
            }
          }
        },
        include: { spectrum: true }
      });
      res.json({ success: true, data: test });
    } catch (dbError) {
      console.warn(`Database update failed for capture. Returning mock capture.`);
      res.json({
        success: true,
        data: { id, status: 'CAPTURED' },
        warning: 'Demo Mode'
      });
    }
  } catch (error) {
    console.error('Capture error:', error);
    res.status(500).json({ success: false, message: 'Failed to capture spectrum' });
  }
};

export const analyzeTest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let mockScenario = undefined;

    try {
      const test = await prisma.test.findUnique({ where: { id: id as string }, include: { spectrum: true } }) as any;
      if (test?.spectrum?.metadata) {
        mockScenario = (test.spectrum.metadata as any).mockScenario;
      }
    } catch (e) {
      // Ignore DB read failure, proceed with default or body provided scenario
    }
    
    if (!mockScenario && req.body.mockScenario) {
        mockScenario = req.body.mockScenario;
    }

    const mockBuffer = Buffer.from('mock_image_data');
    const prediction = await analyzeSpectrum(mockBuffer, mockScenario);

    try {
      const updatedTest = await prisma.test.update({
        where: { id: id as string },
        data: {
          status: 'COMPLETED',
          prediction: {
            create: {
              predictedClass: prediction.class as any,
              confidenceScore: prediction.confidence
            }
          }
        },
        include: { prediction: true }
      });
      res.json({ success: true, data: updatedTest });
    } catch (dbError) {
      console.warn(`Database update failed for analysis. Returning mock prediction.`);
      res.json({
        success: true,
        data: {
          id,
          status: 'COMPLETED',
          prediction: {
            predictedClass: prediction.class,
            confidenceScore: prediction.confidence
          }
        },
        warning: 'Demo Mode'
      });
    }
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ success: false, message: 'Failed to analyze test' });
  }
};

export const getTests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    
    const tests = await prisma.test.findMany({
      where: { userId },
      include: { prediction: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ success: true, data: tests });
  } catch (error) {
    console.warn('Database fetch failed. Returning mock data.');
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};

export const getTestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;
    
    const test = await prisma.test.findUnique({
      where: { id },
      include: { prediction: true, spectrum: true, location: true }
    });
    
    if (!test) {
      res.status(404).json({ success: false, message: 'Test not found' });
      return;
    }

    if (test.userId !== userId && userRole !== 'INSPECTOR' && userRole !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Access denied' });
      return;
    }
    
    res.json({ success: true, data: test });
  } catch (error) {
    console.warn(`Database fetch failed for ID ${req.params.id}.`);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};
