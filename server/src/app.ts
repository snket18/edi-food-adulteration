import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import testRoutes from './routes/testRoutes';
import monitoringRoutes from './routes/monitoringRoutes';
import reportRoutes from './routes/reportRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken, requireRole } from './middleware/authMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

// Placeholder routes
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'SpectraCheck API is running' });
});

app.use('/api/auth', authRoutes);

// Protected routes
// All authenticated users can access tests
app.use('/api/tests', authenticateToken, testRoutes);

// Only INSPECTOR and ADMIN can access monitoring and reports
app.use('/api/monitoring', authenticateToken, requireRole('INSPECTOR', 'ADMIN'), monitoringRoutes);
app.use('/api/reports', authenticateToken, requireRole('INSPECTOR', 'ADMIN'), reportRoutes);

app.use('/api/analysis', authenticateToken, (req, res) => { res.json({ message: 'Analysis route placeholder' }); });
app.use('/api/dashboard', authenticateToken, (req, res) => { res.json({ message: 'Dashboard route placeholder' }); });
app.use('/api/locations', authenticateToken, requireRole('INSPECTOR', 'ADMIN'), (req, res) => { res.json({ message: 'Locations route placeholder' }); });
app.use('/api/users', (req, res) => { res.json({ message: 'Users route placeholder' }); });

// Centralized error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

export default app;
