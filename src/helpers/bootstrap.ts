import { Response, Request, NextFunction } from "express";

const bootstrap = (_: Request, res: Response, next: NextFunction) => {
  res.sendResponse = (code: string, data: any) => {
    res.status(200).json({
      code: code || "200",
      status: "success",
      data,
    });
  };

  return next();
};

export default bootstrap;
