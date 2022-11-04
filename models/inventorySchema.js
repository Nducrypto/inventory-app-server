import mongoose from "mongoose";

const inventorySchema = mongoose.Schema({
  type: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  creator: String,
  date: {
    type: Date,
    default: new Date(),
  },
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
