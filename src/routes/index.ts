import { Express } from "express";
import AuthRouter from "./Auth/router";
import FamilyRouter from "./Family/router";
import ExpenseCategoryRouter from "./ExpenseCategory/router";
import ExpenseRouter from "./Expense/router";
import UserRouter from "./User/router";
import useAuth from "../middlewares/useAuth";
import useFamily from "../middlewares/useFamily";
import useCurrentTime from "../middlewares/useCurrentTime";

const routes = (app: Express) => {
  app.use((req, res, next) => {
    console.log(req.url);
    next();
  });
  app.use("/api/auth", AuthRouter);
  app.use("/api/family", useAuth, FamilyRouter);
  app.use("/api/expense-category", useAuth, useFamily, ExpenseCategoryRouter);
  app.use("/api/expense", useAuth, useFamily, useCurrentTime, ExpenseRouter);
  app.use("/api/user", useAuth, UserRouter);
  app.get("/", (req, res) => {
    res.send("Hello World");
  });
};

export default routes;
