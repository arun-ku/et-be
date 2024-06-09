import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      currentMonth: number;
      currentYear: number;
    }
  }
}

const useCurrentTime = (req: Request, res: Response, next: NextFunction) => {
  const { year, month } = req.headers;
  if (month) {
    req.currentMonth = +month;
  } else {
    req.currentMonth = new Date().getMonth();
  }

  if (year) {
    req.currentYear = +year;
  } else {
    req.currentYear = new Date().getFullYear();
  }

  next();
};

export default useCurrentTime;
