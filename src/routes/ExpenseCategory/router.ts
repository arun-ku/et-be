import { Router } from "express";
import ExpenseCategory from "../../models/ExpenseCategory";

const router = Router();

router.get("/list", async (req, res) => {
  const family = req.family;
  const expenseCategories = await ExpenseCategory.find({
    familyId: family._id,
  })
    .lean()
    .exec();

  return res.sendResponse("200", expenseCategories);
});

router.post("/create", async (req, res) => {
  const { categoryName, categoryIcon } = req.body;
  const family = req.family;

  const expenseCategory = await ExpenseCategory.create({
    familyId: family._id,
    categoryName,
    categoryIcon,
  });

  return res.sendResponse("200", expenseCategory);
});

export default router;
