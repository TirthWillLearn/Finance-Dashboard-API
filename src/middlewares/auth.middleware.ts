import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as {
      id: number;
      role: string;
    };
    req.body.user_id = decoded.id;
    req.body.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.body.role;

      if (allowedRoles.includes(role)) {
        next();
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
