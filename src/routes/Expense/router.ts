import { Router } from "express";
import Expense from "../../models/Expense";
import Users from "../../models/Users";

const router = Router();

router.get("/list", async (req, res) => {
  const family = req.family;
  const expenses = await Expense.find({
    familyId: family._id,
  })
    .lean()
    .exec();

  return res.sendResponse("200", expenses);
});

router.post("/create", async (req, res) => {
  const { amount, title, description, categoryId } = req.body;
  const family = req.family;
  const user = await Users.findOne({ phoneNumber: req.user.phoneNumber })
    .lean()
    .exec();

  if (user) {
    const expense = await Expense.create({
      familyId: family._id,
      userId: user._id,
      amount,
      title,
      description,
      categoryId,
    });

    return res.sendResponse("200", expense);
  } else {
    return res.sendResponse("408", "User not found.");
  }
});

export default router;
