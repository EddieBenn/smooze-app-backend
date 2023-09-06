import { NextFunction, Request, Response } from "express";
import { UserPayload } from "../../interface";

export const restrictToAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.user as UserPayload;
  if (role !== "admin")
    throw {
      code: 403,
      message: "You do not have permission to perform this action",
    };
  next();
};
