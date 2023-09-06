import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserInstance } from "../../model";
import {
  GenerateSalt,
  GenerateSignature,
  GeneratePassword,
  validatePassword,
  verifySignature,
} from "../../utils/auth-utils";
import { UserAttributes, UserPayload } from "../../interface";
import { v4 as UUID } from "uuid";
import {
  sendEmail,
  welcomeEmail,
  passworTemplate,
} from "../../utils/notification";

/* =============SIGNUP=======================. */

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, userName, password, gender, date_birth } = req.body;
    const uuiduser = UUID();

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    //check if user already exists using key value pairs in the object
    const userCheck = await UserInstance.findOne({ where: { email: email } });
    //Create User
    if (!userCheck) {
      let newUser = (await UserInstance.create({
        id: uuiduser,
        email,
        userName,
        gender,
        date_birth,
        password: userPassword,
        salt,
        role: "user",
        verified: false,
        is_premium: false,
        isLoggedIn: false,
      })) as unknown as UserAttributes;
      const token = await GenerateSignature({
        id: newUser.id,
        email: newUser.email,
        verified: newUser.verified,
        role: newUser.role,
        is_premium: false,
        isLoggedIn: newUser.isLoggedIn,
      });
      const temp = welcomeEmail(userName, token);
      await sendEmail(email, "Signup Success", temp);

      return res.status(201).json({
        message:
          "User created successfully, check your email to activate you account",
        token,
      });
    } else {
      //User already exists
      throw { code: 400, message: "User already exists" };
    }
  } catch (err) {
    next(err);
  }
};

/* =============LOGIN=======================. */
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;
    if (!User) {
      throw { code: 400, message: "Invalide Email or Password" };
    } else {
      if (!User.verified) throw { code: 400, message: "Account Not Activated" };
      //validate password

      const validPassword = await validatePassword(
        password,
        User.password,
        User.salt
      );

      if (!validPassword)
        throw { code: 400, message: "Invalide Email or Password" };
      //updated loggedin status
      (await UserInstance.update(
        {
          isLoggedIn: true,
        },
        {
          where: {
            email: email,
          },
        }
      )) as unknown as UserPayload | UserAttributes;
      const loggedinUser = (await UserInstance.findOne({
        where: { email: email },
      })) as unknown as UserAttributes;
      const payload: UserPayload = {
        id: loggedinUser.id,
        email: loggedinUser.email,
        verified: loggedinUser.verified,
        isLoggedIn: loggedinUser.isLoggedIn,
        role: loggedinUser.role,
        is_premium: loggedinUser.is_premium,
      };
      const signature = await GenerateSignature(payload);

      return res.status(200).json({
        message: "Login Successful",
        signature: signature,
        user: User,
      });
    }
  } catch (error) {
    next(error);
  }
};

/* =============UPDATE=======================. */
export const update = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user.id;

    const User = (await UserInstance.findOne({
      where: { id: id },
    })) as unknown as UserAttributes;

    const { firstName, lastName, email, country, gender, day, month, year  } =
      req.body;
      const date_birth = (day && month && year) ? new Date(`${month} ${day}, ${year}`) : null
          // Number(date_birth.slice(3, 5)),
          // Number(date_birth.slice(0, 2))
        
      

    if (!User) throw { code: 401, message: "unAuthorised please Login" };
    const updatedUser = (await UserInstance.update(
      {
        firstName: firstName || User.firstName,
        lastName: lastName || User.lastName,
        email: email || User.email,
        country: country || User.country,
        gender: gender || User.gender,
        date_birth: date_birth || User.date_birth,
        day: day || User.day,
        month: month || User.month,
        year: year || User.year,
        profileImage: req.file ? req.file.path : User.profileImage,
      },
      { where: { id: id } }
    )) as unknown as UserAttributes;

    if (updatedUser) {
      const User = (await UserInstance.findOne({
        where: { id: id },
      })) as unknown as UserAttributes;

      return res.status(200).json({
        message: "You have successfully updated your profile",
        User,
      });
    }
    throw { code: 500, message: "Something went wrong" };
  } catch (error) {
    next(error);
  }
};

/*================= verify User ================*/
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.query.token;
    if (typeof token === "string") {
      const verified = await verifySignature(token);
      //check if user exits
      if (!verified) throw { code: 400, message: "Please Register An Account" };
      if (verified) {
        await UserInstance.update(
          {
            verified: true,
          },
          {
            where: { id: verified.id },
          }
        );
        return res.status(200).json({
          message: "Account verified Please Login !",
        });
      }
    }
    throw { code: 401, message: "Unauthorized" };
  } catch (error) {
    next(error);
  }
};

/*================= logout======================*/
export const logout = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;
  await UserInstance.update(
    {
      isLoggedIn: false,
    },
    {
      where: { id: id },
    }
  );
  return res.status(200).json({
    message: "Successfuly Loggedout",
  });
};




/*================= forgot Password ================*/

export const requestPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const user = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as UserAttributes;
    if (!user) {
      // __TEST MESSAGE__ wrong message this should be an error
      return res.status(200).json({
        code: 200,
        message: "Check Your Email to Continue !!",
      });
    } else {
      const otp = await GenerateSalt();
      let token = await GenerateSignature({
        id: user.id,
        email,
        otp,
      });
      await UserInstance.update(
        {
          otp: otp,
        },
        {
          where: { id: user.id },
        }
      );
      const template = await passworTemplate(user.userName, token);
      await sendEmail(user.email, "PASSWORD RESETE", template);
      // __TEST MESSAGE__ dont send token as response or user will be able to reset pwd without checking email
      res.status(200).json({
        code: 200,
        signature: token,
        message: "Check Your Email to Continue !!",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const changepassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, password } = req.body;
    const data = await verifySignature(token);
    const { id, email, otp } = data;
    const user = await UserInstance.findOne({
      where: {
        email: email,
        otp,
      },
    });
    if (!user) throw { code: 401, message: "Not Valid" };
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    await UserInstance.update(
      {
        salt,
        password: userPassword,
        otp: "",
      },
      {
        where: { id: id },
      }
    );
    res
      .status(201)
      .json({ code: 201, message: "password updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user.id;
    const user = (await UserInstance.findOne({
      where: { id },
    })) as unknown as UserAttributes;
    res.status(201).json({ code: 200, user });
  } catch (err) {
    next(err);
  }
};
