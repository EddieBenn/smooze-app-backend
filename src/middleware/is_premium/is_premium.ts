import { Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserAttributes } from "../../interface";
import { UserInstance } from "../../model";

export const is_premium = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, id, is_premium, role } = req.user;
    const isPremium = () => {
      return is_premium || role === "admin" ? true : false;
    };

    console.log(isPremium);
    if (!isPremium)
      throw { code: 401, message: "please upgrade to Premuim Account !!" };
    const user = (await UserInstance.findOne({
      where: {
        id: id,
        email: email,
      },
    })) as unknown as UserAttributes;
    if (user.is_premium || user.role === "admin") {
      next();
    } else {
      throw { code: 401, message: "please upgrade to Premuim Account !! " };
    }
  } catch (error) {
    next(error);
  }
};
