import { sign } from "jsonwebtoken";
import nodemailer from "nodemailer";

export const generateToken = (id: string) => {
  return sign(
    {
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};
