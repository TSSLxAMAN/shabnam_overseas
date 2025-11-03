// // middleware/auth.middleware.ts
// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import { Request, Response, NextFunction } from 'express';
// import Admin from '../models/admin.model';

// interface AuthRequest extends Request {
//   admin?: any;
// }

// export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
//   let token: string | undefined;

//   if (req.headers.authorization?.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];

//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       console.error('❌ JWT_SECRET is not set in .env');
//       res.status(500);
//       throw new Error('JWT_SECRET is not defined');
//     }

//     try {
//       const decoded = jwt.verify(token, secret) as { id: string };
//       req.admin = await Admin.findById(decoded.id).select('-password');

//       if (!req.admin) {
//         res.status(401);
//         throw new Error('Not authorized, admin not found');
//       }

//       next();
//     } catch (error: any) {
//       console.error('❌ JWT verification failed:', error.message);
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   }

//   if (!token) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });



















// // middleware/auth.middleware.ts
// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import { Request, Response, NextFunction } from 'express';
// import Admin from '../models/admin.model';
// import User from '../models/user.model';

// interface AuthRequest extends Request {
//   admin?: any;
//   user?: any;
// }

// export const protectUserOrAdmin = asyncHandler(
//   async (req: AuthRequest, res: Response, next: NextFunction) => {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith('Bearer')
//     ) {
//       token = req.headers.authorization.split(' ')[1];
//       const secret = process.env.JWT_SECRET;

//       if (!secret) {
//         throw new Error('JWT_SECRET is not defined');
//       }

//       try {
//         const decoded = jwt.verify(token, secret) as { id: string };

//         // Try finding admin first
//         const admin = await Admin.findById(decoded.id).select('-password');
//         if (admin) {
//           req.admin = admin;
//           return next();
//         }

//         // Try finding user
//         const user = await User.findById(decoded.id).select('-password');
//         if (user) {
//           req.user = user;
//           return next();
//         }

//         throw new Error('Not authorized, user or admin not found');
//       } catch (err: any) {
//         console.error('JWT error:', err.message);
//         res.status(401);
//         throw new Error('Not authorized, token failed');
//       }
//     }

//     if (!token) {
//       res.status(401);
//       throw new Error('Not authorized, no token');
//     }
//   }
// );

// // 🛡️ Admin-only middleware
// export const protectAdmin = asyncHandler(
//   async (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (req.admin && req.admin.role === 'superadmin') {
//       next();
//     } else {
//       res.status(403);
//       throw new Error('Not authorized as admin');
//     }
//   }
// );













// middleware/auth.middleware.ts
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import Admin from "../models/admin.model";
import User from "../models/user.model";

export interface AuthRequest extends Request {
  admin?: any;
  user?: any;
}

// 🟢 Allow both User or Admin
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("🔹 Received Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      // Check admin first
      const admin = await Admin.findById(decoded.id).select("-password");
      if (admin) {
        req.admin = admin;
        return next();
      }

      // Then check user
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        return next();
      }

      res.status(401);
      throw new Error("Not authorized, user or admin not found");
    } catch (err) {
      // console.error("❌ JWT error:", err);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  res.status(401);
  throw new Error("Not authorized, no token");
});

// 🔒 Admin only
export const protectAdmin = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    // console.log(
    //   "🔹 Authorization header from frontend:",
    //   req.headers.authorization
    // ); // <--- ADD THIS

    token = req.headers.authorization.split(" ")[1];
    // console.log("🔹 Received Admin Token:", token);

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        res.status(401);
        throw new Error("Not authorized as admin");
      }

      req.admin = admin;
      next();
    } catch (err) {
      // console.error("❌ JWT verification error:", err);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

});

// 🏆 Superadmin only
export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.admin?.role === "superadmin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden: Only superadmins allowed" });
};
