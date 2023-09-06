import express, { Request, Response, NextFunction } from "express";
export const errorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  res.status(error.code || 500).json({
    code: error.code || 500,
    error: error.message || "Something Went Wrong",
  });
};

export const errorRouterHandler = express.Router();
errorRouterHandler.all("/*", () => {
  throw { code: 404, message: "End of Page" };
});
