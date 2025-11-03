import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";
import User from "../models/user.model";
import asyncHandler from "express-async-handler";

export interface AuthRequest extends Request {
  user?: any;
  admin?: any;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        ) as JwtPayload; // ✅ Use JwtPayload

        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
          res.status(401);
          throw new Error("User not found");
        }

        return next();
      } catch (error) {
        // console.error(error);
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }

    res.status(401);
    throw new Error("Not authorized, no token");
  }
);

export const protectAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log("Received Admin Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload; // ✅ Now JwtPayload is defined
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({ message: "Not authorized as admin" });
      }

      // @ts-ignore
      req.admin = admin;
      next();
    } catch (error) {
      // console.error("JWT verification error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

export const isSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.admin && req.admin.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Only superadmins allowed" });
  }
};
