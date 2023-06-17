import mongoose from "mongoose";

const historySchema = mongoose.Schema(
  {
    type: { type: String },
    category: { type: String },
    quantityIn: { type: Number },
    quantitySold: { type: Number },
    totalCost: { type: Number },
    outgoingCost: { type: Number },
    price: { type: Number },
    creator: String,
    date: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);

export default History;
