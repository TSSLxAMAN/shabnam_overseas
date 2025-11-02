// src/middleware/checkRole.ts
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  admin?: {
    role: string;
    _id?: any;
    name?: string;
    email?: string;
  };
}

export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
};
