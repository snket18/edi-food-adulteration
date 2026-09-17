"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const monitoringRoutes_1 = __importDefault(require("./routes/monitoringRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Placeholder routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'SpectraCheck API is running' });
});
app.use('/api/auth', authRoutes_1.default);
// Protected routes
// All authenticated users can access tests
app.use('/api/tests', authMiddleware_1.authenticateToken, testRoutes_1.default);
// Only INSPECTOR and ADMIN can access monitoring and reports
app.use('/api/monitoring', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('INSPECTOR', 'ADMIN'), monitoringRoutes_1.default);
app.use('/api/reports', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('INSPECTOR', 'ADMIN'), reportRoutes_1.default);
app.use('/api/analysis', authMiddleware_1.authenticateToken, (req, res) => { res.json({ message: 'Analysis route placeholder' }); });
app.use('/api/dashboard', authMiddleware_1.authenticateToken, (req, res) => { res.json({ message: 'Dashboard route placeholder' }); });
app.use('/api/locations', authMiddleware_1.authenticateToken, (0, authMiddleware_1.requireRole)('INSPECTOR', 'ADMIN'), (req, res) => { res.json({ message: 'Locations route placeholder' }); });
app.use('/api/users', (req, res) => { res.json({ message: 'Users route placeholder' }); });
// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
});
exports.default = app;
