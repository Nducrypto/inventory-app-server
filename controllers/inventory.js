import express from "express";
import mongoose from "mongoose";

import Inventory from "../models/inventorySchema.js";
import History from "../models/HistorySchema.js";

const router = express.Router();

export const getTransactions = async (req, res) => {
  const { creator } = req.query;

  try {
    const transactions = await Inventory.find({ creator }).sort({ _id: -1 });
    const history = await History.find({ creator }).sort({ _id: -1 });

    res.status(200).json({ transactions, history });
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.log(error);
  }
};

export const createTransaction = async (req, res) => {
  try {
    const category = new RegExp(req.body.category, "i");

    const item = await Inventory.findOne({
      category: category,
      creator: req.body.creator,
    });
    // console.log(item);
    if (item && item.type === req.body.type) {
      item.type = item.type;
      item.category = item.category;
      item.price = req.body.price;
      item.quantityIn = Number(item.quantityIn) + Number(req.body.quantity);
      item.quantitySold = item.quantitySold;
      item.quantityRemaining =
        Number(item.quantityIn) - Number(item.quantitySold);
      item.outgoingCost = item.outgoingCost;
      item.totalCost = item.totalCost + req.body.totalCost;

      await item.save();

      res.status(201).json(item);
    } else if (item && item.type !== req.body.type) {
      item.type = item.type;
      item.category = item.category;
      item.price = req.body.price;
      item.quantityIn = item.quantityIn;
      item.quantitySold = Number(item.quantitySold) + Number(req.body.quantity);
      item.quantityRemaining =
        Number(item.quantityIn) - Number(item.quantitySold);
      item.outgoingCost =
        Number(item.outgoingCost) + Number(req.body.totalCost);
      item.totalCost = item.totalCost;

      await item.save();

      res.status(201).json(item);
    } else {
      const newTransaction = new Inventory({
        type: req.body.type,
        category: req.body.category,
        quantityIn: req.body.quantity,
        totalCost: req.body.totalCost,
        outgoingCost: 0,
        price: req.body.price,
        quantitySold: 0,
        creator: req.body.creator,
        date: req.body.date,
        quantityRemaining: 0,
      });
      await newTransaction.save();

      res.status(201).json(newTransaction);
    }

    //  ======= HISTORY SCHEMA =======
    const historyTransaction = new History({
      type: req.body.type,
      category: req.body.category,
      quantityIn: req.body.quantity,
      totalCost: req.body.totalCost,
      outgoingCost: req.body.totalCost,
      price: req.body.price,
      quantitySold: req.body.quantity,
      creator: req.body.creator,
      date: req.body.date,
      quantityRemaining: 0,
    });
    await historyTransaction.save();
    // i didn't return this history json
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllTransaction = async (req, res) => {
  const { _id: id } = req.body;

  await Inventory.findByIdAndDelete(id);
  const category = new RegExp(req.body.category, "i");

  await History.deleteMany({
    id,
    category,
    creator: req.body.creator,
  });

  res.json({ message: "transaction deleted successfully." });
};

export const deleteHistory = async (req, res) => {
  const { _id: id } = req.body;

  await History.findByIdAndDelete(id);
  const category = new RegExp(req.body.category, "i");

  const item = await Inventory.findOne({
    category,
    creator: req.body.creator,
  });

  if (item && item.type === req.body.type) {
    item.type = item.type;
    item.category = item.category;
    item.price = req.body.price;
    item.quantityIn = item.quantityIn - req.body.quantityIn;
    item.quantitySold = item.quantitySold;
    item.quantityRemaining = item.quantityIn - item.quantitySold;
    item.outgoingCost = item.outgoingCost;
    item.totalCost = item.totalCost - req.body.totalCost;

    await item.save();
  } else {
    item.type = item.type;
    item.category = item.category;
    item.price = req.body.price;
    item.quantityIn = item.quantityIn;
    item.quantitySold = item.quantitySold - req.body.quantitySold;
    item.quantityRemaining = item.quantityIn - item.quantitySold;
    item.outgoingCost = item.outgoingCost - req.body.totalCost;
    item.totalCost = item.totalCost;

    await item.save();
  }
  // console.log(item);
  await History.findByIdAndDelete(id);

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
    res.status(409).json({ message: err.message });
  }
};

export default router;
