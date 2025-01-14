import { Response, Request } from "express";
import { compare, genSalt, hash } from "bcryptjs";
import User from "../model/userModel";
import { generateToken } from "../utils";
import { userLoginSchema, validate } from "../utils/validation";
import crypto from "crypto";
import { sendEmail } from "../services/email";

const registerUser = async (req: Request, res: Response) => {
  const { fullname, email, role } = req.body;

  if (!fullname || !email || !role) {
    res.status(400).json({
      success: false,
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
        success: false,
        message: "User already exist",
      });
      return;
    }

    const defaultPassword = crypto.randomBytes(8).toString("hex");
    const salt = await genSalt(10);
    const hashedPassword = await hash(defaultPassword, salt);

    const user = await User.create({
      fullname,
      email,
      role,
      password: hashedPassword,
    });

    if (user) {
      const subject = "Welcome onboard";
      const text = ``;
      const html = `<html>
      <h5\> Hello ${fullname}</h5>,
      <br />
      Your account has been created successfully. <br />
      Here are your login details: Email: ${email}\nPassword: ${defaultPassword} <br />
      Please change your password after logging in. <br /> 
      Best regards, <br />
      Your Team 
     </html>`;

      await sendEmail(email, subject, text, html);

      res.status(201).json({
        success: true,
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
      success: false,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // const error = validate(userLoginSchema, req.body);

  // if (error) {
  //   res.status(400).json({
  //     message: error,
  //     success: false,
  //   });
  //   return;
  // }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(403).json({
        message: "User is not registered",
        success: false,
      });
      return;
    }
    if (user && (await compare(password, user.password))) {
      res.status(200).json({
        success: true,
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
        success: false,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: "Email, current password, and new password are required.",
    });

    return;
  }

  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    // Compare current password with stored hash
    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
      return;
    }

    // Hash new password
    const salt = await genSalt(10);
    const hashedNewPassword = await hash(newPassword, salt);

    // Update user's password
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error changing default password:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export { registerUser, loginUser, changePassword };
