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

  return res.sendResponse("200", expenseCategories, true);
});

router.post("/create", async (req, res) => {
  const { categoryName, categoryIcon, iconColor } = req.body;
  const family = req.family;

  const ignoredCaseRegex = new RegExp(categoryName, "i");

  const doesCategoryExist = await ExpenseCategory.findOne({
    categoryName: ignoredCaseRegex,
    familyId: family._id,
  })
    .lean()
    .exec();

  if (doesCategoryExist) {
    return res.sendResponse(
      "400",
      { message: "Category already exists" },
      false
    );
  } else {
    const expenseCategory = await ExpenseCategory.create({
      familyId: family._id,
      categoryName,
      categoryIcon,
      iconColor,
    });

    return res.sendResponse("200", expenseCategory, true);
  }
});

export default router;
