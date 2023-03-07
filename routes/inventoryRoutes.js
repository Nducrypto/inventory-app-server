import express from "express";

import {
  createTransaction,
  deleteAllTransaction,
  getTransactions,
  updateTransaction,
  inventoryStats,
  deleteHistory,
} from "../controllers/inventory.js";

const router = express.Router();
// import auth from "../middleware/auth.js";

router.get("/", getTransactions);
router.get("/stats", inventoryStats);

router.post("/", createTransaction);
router.delete("/deleteAll", deleteAllTransaction);
router.delete("/deleteOne", deleteHistory);
router.patch("/:id", updateTransaction);

export default router;
