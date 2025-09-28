import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";


export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
  return res.status(401).json({ message: "Unauthorized" });
}

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return res.json("no token");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    req.user = decoded;

    next();
  } catch (error) {
     return res.status(401).json({ message: "Unauthorized" });
  }
}

export default verifyToken;
