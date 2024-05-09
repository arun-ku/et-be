import { Router } from "express";
import Expense from "../../models/Expense";
import Users from "../../models/Users";
import mongoose from "mongoose";

const router = Router();

router.get("/listByCategories", async (req, res) => {
  const family = req.family;
  const expenses = await Expense.aggregate([
    { $match: { familyId: family._id } },
    {
      $group: {
        _id: "$categoryId",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "expenseCategory",
        localField: "_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $project: {
        _id: 0,
        category: { $first: "$category" },
        totalAmount: 1,
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);

  return res.sendResponse("200", expenses, true);
});

router.get("/listByUsers", async (req, res) => {
  const family = req.family;
  const expenses = await Expense.aggregate([
    { $match: { familyId: family._id } },
    {
      $group: {
        _id: "$userId",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        _id: 0,
        user: { $first: "$user" },
        totalAmount: 1,
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);

  return res.sendResponse("200", expenses, true);
});

router.get("/listByUser/:id", async (req, res) => {
  const family = req.family;
  const expenses = await Expense.aggregate([
    {
      $facet: {
        expenses: [
          {
            $match: {
              familyId: family._id,
              userId: new mongoose.Types.ObjectId(req.params.id),
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
              pipeline: [{ $project: { name: 1 } }],
            },
          },
          {
            $lookup: {
              from: "expenseCategory",
              localField: "categoryId",
              foreignField: "_id",
              as: "categoryId",
              pipeline: [
                {
                  $project: {
                    categoryName: 1,
                    categoryIcon: 1,
                    iconColor: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              amount: 1,
              title: 1,
              description: 1,
              userId: { $first: "$userId" },
              categoryId: { $first: "$categoryId" },
              createdAt: 1,
              familyId: 1,
            },
          },
        ],
        totalAmount: [
          {
            $match: {
              familyId: family._id,
              userId: new mongoose.Types.ObjectId(req.params.id),
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
      },
    },
    {
      $project: {
        expenses: 1,
        totalAmount: { $first: "$totalAmount.totalAmount" },
      },
    },
  ]);

  return res.sendResponse("200", expenses?.[0], true);
});

router.get("/listByCategory/:id", async (req, res) => {
  const family = req.family;
  const expenses = await Expense.aggregate([
    {
      $facet: {
        expenses: [
          {
            $match: {
              familyId: family._id,
              categoryId: new mongoose.Types.ObjectId(req.params.id),
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
              pipeline: [{ $project: { name: 1 } }],
            },
          },
          {
            $lookup: {
              from: "expenseCategory",
              localField: "categoryId",
              foreignField: "_id",
              as: "categoryId",
              pipeline: [
                {
                  $project: {
                    categoryName: 1,
                    categoryIcon: 1,
                    iconColor: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              amount: 1,
              title: 1,
              description: 1,
              userId: { $first: "$userId" },
              categoryId: { $first: "$categoryId" },
              createdAt: 1,
              familyId: 1,
            },
          },
        ],
        totalAmount: [
          {
            $match: {
              familyId: family._id,
              categoryId: new mongoose.Types.ObjectId(req.params.id),
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
      },
    },
    {
      $project: {
        expenses: 1,
        totalAmount: { $first: "$totalAmount.totalAmount" },
      },
    },
  ]);

  return res.sendResponse("200", expenses?.[0], true);
});

router.get("/list", async (req, res) => {
  const family = req.family;
  const { month, year }: { month: string; year: string } = req.query as {
    month: string;
    year: string;
  };

  const updatedAtGt = new Date();
  if (month && year) {
    updatedAtGt.setMonth(parseInt(month));
    updatedAtGt.setFullYear(parseInt(year));
  }
  updatedAtGt.setDate(1);
  updatedAtGt.setHours(0);
  const updatedAtLt = new Date();
  if (month && year) {
    updatedAtLt.setMonth(parseInt(month));
    updatedAtLt.setFullYear(parseInt(year));
  }
  updatedAtLt.setMonth(updatedAtLt.getMonth() + 1);
  updatedAtLt.setDate(1);
  updatedAtLt.setHours(0);

  const newResult = await Expense.aggregate([
    {
      $facet: {
        expenses: [
          {
            $match: {
              familyId: family._id,
              createdAt: { $gt: updatedAtGt, $lt: updatedAtLt },
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userId",
              pipeline: [{ $project: { name: 1 } }],
            },
          },
          {
            $lookup: {
              from: "expenseCategory",
              localField: "categoryId",
              foreignField: "_id",
              as: "categoryId",
              pipeline: [
                {
                  $project: {
                    categoryName: 1,
                    categoryIcon: 1,
                    iconColor: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              amount: 1,
              title: 1,
              description: 1,
              userId: { $first: "$userId" },
              categoryId: { $first: "$categoryId" },
              createdAt: 1,
              familyId: 1,
            },
          },
        ],
        totalAmount: [
          {
            $match: {
              familyId: family._id,
              createdAt: { $gt: updatedAtGt, $lt: updatedAtLt },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
      },
    },
    {
      $project: {
        expenses: 1,
        totalAmount: { $first: "$totalAmount.totalAmount" },
      },
    },
  ]);

  return res.sendResponse("200", newResult?.[0], true);
});

router.get("/list/:id", async (req, res) => {
  const family = req.family;
  const expense = await Expense.findOne({
    _id: req.params.id,
    familyId: family._id,
  })
    .populate("userId", "name")
    .populate("categoryId", "categoryName categoryIcon iconColor")
    .lean()
    .exec();

  if (expense) {
    return res.sendResponse("200", expense, true);
  } else {
    return res.sendResponse("408", { message: "Expense not found." }, false);
  }
});

router.delete("/delete/:id", async (req, res) => {
  const family = req.family;
  console.log(req.params.id);
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    familyId: family._id,
  });

  if (expense) {
    return res.sendResponse("200", expense, true);
  } else {
    return res.sendResponse("408", { message: "Expense not found." }, false);
  }
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

    await Expense.populate(expense, {
      path: "userId",
      select: "name",
    });
    await Expense.populate(expense, {
      path: "categoryId",
      select: "categoryName categoryIcon iconColor",
    });

    return res.sendResponse("200", expense, true);
  } else {
    return res.sendResponse("408", { message: "User not found." }, false);
  }
});

router.put("/update/:id", async (req, res) => {
  const { amount, title, description, categoryId } = req.body;
  const family = req.family;
  const user = await Users.findOne({ phoneNumber: req.user.phoneNumber })
    .lean()
    .exec();

  if (user) {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        familyId: family._id,
      },
      {
        userId: user._id,
        amount,
        title,
        description,
        categoryId,
      },
      { new: true }
    );

    if (expense) {
      await Expense.populate(expense, {
        path: "userId",
        select: "name",
      });
      await Expense.populate(expense, {
        path: "categoryId",
        select: "categoryName categoryIcon iconColor",
      });

      return res.sendResponse("200", expense, true);
    } else {
      return res.sendResponse("408", { message: "Expense not found." }, false);
    }
  } else {
    return res.sendResponse("408", { message: "User not found." }, false);
  }
});

export default router;
