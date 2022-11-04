import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserInventory from "../models/userModel.js";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  const { email, firstName, lastName, confirmPassword } = req.body;

  try {
    const existingUser = await UserInventory.findOne({ email });

    if (req.body.password !== confirmPassword)
      return next(createError(404, "Password Don't Match"));

    if (existingUser) return next(createError(402, "User Already Exist."));

    if (
      !email ||
      !firstName ||
      !lastName ||
      !req.body.password ||
      !confirmPassword
    )
      return next(createError(404, "Please fill in the fields"));

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const result = await UserInventory.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign(
      { id: result._id, isAdmin: result.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    res.status(200).json({ result, token });
  } catch (err) {
    next(createError(405, "Failed To Create Account"));
  }
};

export const login = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await UserInventory.findOne({ email });
    if (!existingUser) return next(createError(400, "User Not Found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return next(createError(408, "Wrong Email Or Password"));

    const token = jwt.sign(
      { id: existingUser._id, isAdmin: existingUser.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    const { password, ...otherDetails } = existingUser._doc;

    res.status(200).json({ result: { ...otherDetails }, token });
  } catch (err) {
    next(createError(404, "Failed To Login"));
  }
};
