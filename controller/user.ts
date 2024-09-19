import { Response, Request } from "express";
import { compare, genSalt, hash } from "bcryptjs";
import User from "../model/userModel";
import { generateToken } from "../utils";
import { userLoginSchema, validate } from "../utils/validation";

const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, role, password } = req.body;

  if (!fullname || !email || !role || !password) {
    res.status(400).json({
      message: "All fields are required",
    });
    return;
  }

  try {
    const mailExists = await User.findOne({
      email,
    });

    if (mailExists) {
      res.status(400).json({
        message: "User already exist",
      });
      return;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const user = await User.create({
      fullname,
      email,
      role,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        message: "User created successfully",
        data: {
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()), // Convert ObjectId to string
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const error = validate(userLoginSchema, req.body);

  if (error) {
    res.status(400).json({
      message: error,
    });

    return;
  }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(403).json({
        message: "User is not registered",
      });
      return;
    }
    if (user && (await compare(password, user.password))) {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          token: generateToken(user._id.toString()),
        },
      });
    } else {
      res.status(400).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export { registerUser, loginUser };
