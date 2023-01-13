import express from "express";
import mongoose from "mongoose";

import Inventory from "../models/inventorySchema.js";

const router = express.Router();

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Inventory.find().sort({ _id: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
};
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Inventory.findById(req.params.id);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
};

export const createTransaction = async (req, res) => {
  const transaction = req.body;

  const newTransaction = new Inventory(transaction);

  try {
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No transaction with id: ${id}`);

  await Inventory.findByIdAndRemove(id);

  res.json({ message: "transaction deleted successfully." });
};

export const updateTransaction = async (req, res) => {
  const { id: _id } = req.params;
  const transaction = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send(`No transaction with id: ${id}`);

  const updatedTransaction = await Inventory.findByIdAndUpdate(
    _id,
    transaction,
    {
      new: true,
    }
  );

  res.json(updatedTransaction);
};

// =====STATS
export const inventoryStats = async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  try {
    const income = await Inventory.find({ date: { $gte: lastMonth } });
    res.status(200).json(income);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
};

export default router;
