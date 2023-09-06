import jwt from "jsonwebtoken";
import config from "../../config";
import { UserPayload } from "../../interface";

import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PasswordPayload } from "../../interface/resetPassword.dto";

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword;
};

export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const GenerateSignature = async (
  payload:
    | UserPayload
    | PasswordPayload
    | { [key: string]: string | number | undefined | boolean }
) => {
  return jwt.sign(payload, config.APP_SECRETE, { expiresIn: "20d" });
};

export const verifySignature = async (signature: string) => {
  return jwt.verify(signature, config.APP_SECRETE) as JwtPayload;
};
