"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestById = exports.getTests = exports.saveTest = exports.analyzeTest = void 0;
const mlService_1 = require("../services/mlService");
const prisma_1 = require("../utils/prisma");
// Generate ID: SC-YYYYMMDD-XXX
const generateTestId = async () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    // In a real app we'd query the DB for the highest ID today. 
    // For the prototype, we generate a random 3-digit suffix or pseudo-count.
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    return `SC-${dateStr}-${randomSuffix}`;
};
const analyzeTest = async (req, res) => {
    try {
        const { mockScenario } = req.body;
        // Simulate passing a buffer
        const mockBuffer = Buffer.from('mock_image_data');
        const prediction = await (0, mlService_1.analyzeSpectrum)(mockBuffer, mockScenario);
        res.json({
            success: true,
            data: prediction
        });
    }
    catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ success: false, message: 'Failed to analyze spectrum' });
    }
};
exports.analyzeTest = analyzeTest;
const saveTest = async (req, res) => {
    try {
        const { predictedClass, confidence, notes } = req.body;
        const testId = await generateTestId();
        try {
            // Attempt to save to Prisma
            // Note: We use a placeholder user ID for this prototype until Auth is fully implemented
            const test = await prisma_1.prisma.test.create({
                data: {
                    id: testId,
                    userId: 'mock-user-123',
                    status: 'COMPLETED',
                    notes,
                    prediction: {
                        create: {
                            predictedClass,
                            confidenceScore: confidence
                        }
                    },
                    spectrum: {
                        create: {
                            imageUrl: '/placeholder.jpg'
                        }
                    }
                },
                include: {
                    prediction: true
                }
            });
            res.status(201).json({ success: true, data: test });
        }
        catch (dbError) {
            // Fallback for when Neon PostgreSQL is not configured yet
            console.warn('Database save failed (Likely Neon URL not configured). Returning mock success.');
            console.warn(dbError);
            res.status(201).json({
                success: true,
                data: {
                    id: testId,
                    userId: 'mock-user-123',
                    timestamp: new Date(),
                    status: 'COMPLETED',
                    prediction: {
                        predictedClass,
                        confidenceScore: confidence
                    }
                },
                warning: 'Database not connected. Result was not permanently saved.'
            });
        }
    }
    catch (error) {
        console.error('Save test error:', error);
        res.status(500).json({ success: false, message: 'Failed to save test result' });
    }
};
exports.saveTest = saveTest;
const getTests = async (req, res) => {
    try {
        const userId = 'mock-user-123';
        const tests = await prisma_1.prisma.test.findMany({
            where: { userId },
            include: { prediction: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: tests });
    }
    catch (error) {
        console.warn('Database fetch failed (Likely Neon URL not configured). Returning 500 so frontend falls back to mock data.');
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
};
exports.getTests = getTests;
const getTestById = async (req, res) => {
    try {
        const id = req.params.id;
        const test = await prisma_1.prisma.test.findUnique({
            where: { id },
            include: { prediction: true }
        });
        if (!test) {
            res.status(404).json({ success: false, message: 'Test not found' });
            return;
        }
        res.json({ success: true, data: test });
    }
    catch (error) {
        console.warn(`Database fetch failed for ID ${req.params.id}. Returning 500 so frontend falls back to mock data.`);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
};
exports.getTestById = getTestById;
