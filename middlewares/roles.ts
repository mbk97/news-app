import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  };
};
