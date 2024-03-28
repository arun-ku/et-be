import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: { name: string; phoneNumber: string };
    }
  }
}

const useAuth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization) {
    try {
      const token = authorization.split(" ")[1];
      const decodedToken: { name: string; phoneNumber: string } = jwt.verify(
        token,
        "mwbbaujkjsnbd_vaHjka"
      ) as { name: string; phoneNumber: string };
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.sendResponse("401", "Unauthorized", false);
    }
  } else {
    return res.sendResponse("401", "Unauthorized", false);
  }
};

export default useAuth;
