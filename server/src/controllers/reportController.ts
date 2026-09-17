import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

export const getReportData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all tests with their prediction and location
    // In a real production system with millions of records, we would accept filters in the query
    // and paginate. For this reporting prototype, fetching the dataset allows instant frontend filtering.
    const tests = await db.test.findMany({
      include: {
        prediction: true,
        location: true
      },
      orderBy: { createdAt: 'desc' },
      take: 500 // Limit for prototype safety
    });
    
    // Transform to flat format suitable for reports
    const reportData = tests.map(t => ({
      testId: t.id,
      classification: t.prediction?.predictedClass,
      adulterant: t.prediction?.predictedClass === 'PURE' ? null : t.prediction?.predictedClass,
      confidence: t.prediction?.confidenceScore,
      timestamp: t.createdAt,
      latitude: t.location?.latitude,
      longitude: t.location?.longitude
    }));

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.warn('Database fetch failed for Report Data. Returning 500.');
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
};
