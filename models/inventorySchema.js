import mongoose from "mongoose";

const inventorySchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    outgoingCost: { type: Number, required: true },
    price: { type: Number, required: true },
    quantitySold: { type: Number },
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
