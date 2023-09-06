import { Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserInstance } from "../../model";
import { UserAttributes, UserPayload } from "../../interface";
import { GenerateSignature } from "../../utils/auth-utils";
import { sendEmail } from "../../utils/notification";
import config from "../../config";

export const paymentMethod = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user.id;
    const { paystackResponse, transactionref } = req.body;
    console.log(transactionref);

    if (paystackResponse === "success") {
      (await UserInstance.update(
        {
          is_premium: true,
        },
        { where: { id: id } }
      )) as unknown as UserAttributes;
      const updatedUser = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;
      if (updatedUser.is_premium) {
        const payload: UserPayload = {
          id: updatedUser.id,
          email: updatedUser.email,
          verified: updatedUser.verified,
          isLoggedIn: updatedUser.isLoggedIn,
          role: updatedUser.role,
          is_premium: updatedUser.is_premium,
        };

        const signature = await GenerateSignature(payload);
        return res.status(200).json({
          message: "Congratulations, you are now a Premium User",
          signature: signature,
          updatedUser,
        });
      } else {
        let html = `${
          updatedUser.email
        } tried to upgrade but failed @ ${new Date().getDate()}`;
        await sendEmail(`${config.FROM_ADMIN_EMAIL}`, "Failt upgrade", html);
        throw {
          code: 500,
          message: "Could not update",
          //send admin message
        };
      }
    } else {
      throw {
        code: 400,
        message: "Your Payment Failed",
      };
    }
  } catch (err) {
    next(err);
  }
};
