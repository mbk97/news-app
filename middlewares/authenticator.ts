import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/userModel"; // Adjust to your user model path

interface JwtPayload {
  id: string;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Authenticating user...", process.env.JWT_SECRET);
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token || token.trim() === "") {
    res.status(401).json({ message: "Unauthorized, No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.id || user._id?.toString(),
      role: user.roleName,
      ...user.toObject?.(),
    };
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
