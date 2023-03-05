import express from "express";

import {
  createTransaction,
  deleteAllTransaction,
  getTransactions,
  getHistory,
  updateTransaction,
  inventoryStats,
  deleteHistory,
  getPercDetails,
} from "../controllers/inventory.js";

const router = express.Router();
// import auth from "../middleware/auth.js";

router.get("/", getTransactions);
router.get("/stats", inventoryStats);
router.get("/history", getHistory);
router.get("/percdetails", getPercDetails);
router.post("/", createTransaction);
router.delete("/deleteAll", deleteAllTransaction);
router.delete("/deleteOne", deleteHistory);
router.patch("/:id", updateTransaction);

export default router;
