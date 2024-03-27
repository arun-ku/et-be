import { Express } from "express";
import AuthRouter from "./Auth/router";
import FamilyRouter from "./Family/router";
import ExpenseCategoryRouter from "./ExpenseCategory/router";
import useAuth from "../middlewares/useAuth";
import useFamily from "../middlewares/useFamily";

const routes = (app: Express) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/family", useAuth, FamilyRouter);
  app.use("/api/expense-category", useAuth, useFamily, ExpenseCategoryRouter);
};

export default routes;
