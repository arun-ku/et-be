import mongoose from "mongoose";

mongoose.pluralize(null);

const expenseSchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  amount: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "expenseCategory" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Expense = mongoose.model("expense", expenseSchema);

export default Expense;
