import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Family from "../models/Family";

declare global {
  namespace Express {
    interface Request {
      family: {
        _id: Types.ObjectId;
        familyName: string;
      };
    }
  }
}

const useFamily = async (req: Request, res: Response, next: NextFunction) => {
  const { family } = req.headers;
  if (family) {
    try {
      const currentFamily = await Family.findOne({
        _id: new mongoose.Types.ObjectId(family as string),
      });
      if (currentFamily) {
        req.family = {
          _id: currentFamily._id as Types.ObjectId,
          familyName: currentFamily.familyName,
        };
      }
      next();
    } catch (error) {
      return res.sendResponse(
        "408",
        { message: "Family not selected." },
        false
      );
    }
  } else {
    return res.sendResponse("408", { message: "Family not selected." }, false);
  }
};

export default useFamily;
