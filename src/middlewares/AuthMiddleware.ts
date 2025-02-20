import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const secretKey = process.env.SECRET_KEY || "defaultSecretKey";

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
