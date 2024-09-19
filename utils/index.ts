import { sign } from "jsonwebtoken";

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
