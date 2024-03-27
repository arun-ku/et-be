import mongoose from "mongoose";

mongoose.pluralize(null);

const expenseCategorySchema = new mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  categoryName: { type: String, required: true },
  categoryIcon: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ExpenseCategory = mongoose.model(
  "expenseCategory",
  expenseCategorySchema
);

export default ExpenseCategory;
