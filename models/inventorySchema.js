import mongoose from "mongoose";

const inventorySchema = mongoose.Schema(
  {
    type: { type: String },
    category: { type: String },
    quantityIn: { type: Number },
    quantityRemaining: { type: Number },
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

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
