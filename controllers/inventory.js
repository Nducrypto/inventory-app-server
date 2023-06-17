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

    // query
    const query = {
      category,
      creator: req.body.creator,
    };
    // find item
    const item = await Inventory.findOne(query);

    if (item && item.type === req.body.type) {
      const update = {
        $inc: {
          quantityIn: req.body.quantity,
          quantityRemaining: req.body.quantity,
          totalCost: req.body.totalCost,
        },
      };

      const updatedItem = await Inventory.findOneAndUpdate(query, update, {
        new: true,
      });

      res.status(201).json(updatedItem);
    } else if (item && item.type !== req.body.type) {
      if (item.quantityIn - item.quantitySold < req.body.quantity) {
        res.status(400).json({
          error: "Quantity in is less than the requested quantity",
        });
        return;
      }

      const update = {
        $inc: {
          quantitySold: req.body.quantity,
          quantityRemaining: -req.body.quantity,
          outgoingCost: req.body.totalCost,
        },
      };

      const updatedItem = await Inventory.findOneAndUpdate(query, update, {
        new: true,
      });

      res.status(201).json(updatedItem);
    } else {
      const newTransaction = new Inventory({
        type: req.body.type,
        category: req.body.category,
        quantityIn: req.body.quantity,
        quantityRemaining: req.body.quantity,
        totalCost: req.body.totalCost,
        price: req.body.price,
        creator: req.body.creator,
        date: req.body.date,
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
    });
    await historyTransaction.save();
    // i didn't return this history json
  } catch (error) {
    console.log(error);
  }
};

// delete for dashbord
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

// delete for history
export const deleteHistory = async (req, res) => {
  const category = new RegExp(req.body.category, "i");

  const query = {
    category,
    creator: req.body.creator,
  };

  const item = await Inventory.findOne(query);

  if (item && item.type === req.body.type) {
    const update = {
      $inc: {
        quantityIn: -req.body.quantityIn,
        totalCost: req.body.totalCost,
      },
    };

    const updatedItem = await Inventory.findOneAndUpdate(query, update, {
      new: true,
    });
  } else {
    const update = {
      $inc: {
        quantitySold: -req.body.quantitySold,
        quantityRemaining: req.body.quantitySold,
        outgoingCost: -req.body.totalCost,
      },
      $set: {
        price: req.body.price,
      },
    };

    const updatedItem = await Inventory.findOneAndUpdate(query, update, {
      new: true,
    });
  }
  // console.log(item);
  await History.findByIdAndDelete(req.body._id);

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
