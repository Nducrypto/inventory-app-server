import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserInventory from "../models/userModel.js";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const existingUser = await UserInventory.findOne({ email });

    if (req.body.password !== confirmPassword)
      return next(createError(404, "Password Don't Match"));

    if (existingUser) return next(createError(402, "User Already Exist."));

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const result = await UserInventory.create({
      email,
      password: hashedPassword,
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
    const existingUser = await UserInventory.findOne({ email: email });
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

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserInventory.find({ _id: req.params.id });
    res.status(200).json(user);
  } catch (err) {
    next(createError(401, "error making user request"));
  }
};

export const updateUser = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await UserInventory.findById(req.params.id);
    if (user) {
      const { _id, email, bio, firstName, phoneNumber, lastName } = user;
      user.email = req.body.email || email;
      user.firstName = req.body.firstName || firstName;
      user.lastName = req.body.lastName || lastName;
      user.bio = req.body.bio || bio;
      user.phoneNumber = req.body.phoneNumber || phoneNumber;
    }
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    next(createError(401, "failed to update"));
  }
};
