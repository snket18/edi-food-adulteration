"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const authenticateToken = (req, res, next) => {
    // Placeholder: Extract JWT token from Authorization header and verify
    // For now, simply mock a user or pass through for development
    const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    // if (token == null) return res.sendStatus(401);
    // TODO: jwt.verify implementation
    // MOCK:
    req.user = { id: 'mock-user-id', role: 'CONSUMER' };
    next();
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
        }
        next();
    };
};
exports.requireRole = requireRole;
