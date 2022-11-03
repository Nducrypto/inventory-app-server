import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  type: String,
  category: String,
  quantity: Number,
  amount: Number,
  price: Number,
  date: {
    type: Date,
    default: new Date(),
  },
});

const Inventory = mongoose.model("Inventory", postSchema);

export default Inventory;
