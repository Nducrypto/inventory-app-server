import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return next(createError(404, "You Don't Have Token To Do This"));

    const existingUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!existingUser) return next(createError(402, "token is not valid"));
    if (existingUser.id || isAdmin) {
      next();
    } else {
      return next(createError(404, "You're Not Authoriized"));
    }
  } catch (err) {
    next(createError(400, "Failed"));
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token)
      return next(createError(404, "You Don't Have Token To Do This"));

    const existingUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!existingUser) return next(createError(402, "token is not valid"));

    if (existingUser.isAdmin) {
      next();
    } else {
      return next(createError(405, "You're Not An Admin"));
    }
  } catch (err) {
    next(createError(405, "failed"));
  }
};
