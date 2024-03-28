import { Response, Request, NextFunction } from "express";

const bootstrap = (_: Request, res: Response, next: NextFunction) => {
  res.sendResponse = (code: string, data: any, isSuccess?: boolean) => {
    res.status(200).json({
      code: code || "200",
      isSuccess: isSuccess ?? true,
      data,
    });
  };

  return next();
};

export default bootstrap;
