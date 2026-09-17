import { Request, Response, NextFunction } from 'express';

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
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

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};
