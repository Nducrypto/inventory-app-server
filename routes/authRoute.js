import express from "express";

import {
  register,
  login,
  getUserById,
  updateUser,
} from "../controllers/authController.js";
const router = express.Router();
// import auth from "../middleware/auth.js";

router.post("/register", register);
router.post("/login", login);

router.get("/:id", getUserById);
router.put("/:id", updateUser);

export default router;
