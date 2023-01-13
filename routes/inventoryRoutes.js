import express from "express";

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  inventoryStats,
} from "../controllers/inventory.js";

const router = express.Router();
// import auth from "../middleware/auth.js";

router.get("/", getTransactions);
router.get("/stats", inventoryStats);
router.get("/:id", getTransaction);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.patch("/:id", updateTransaction);

export default router;
