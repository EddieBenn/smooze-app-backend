import express from "express";
import { Register, signin, update, getUser } from "../handlers/userHandler";
import {
  requestPassword,
  verifyUser,
  changepassword,
  logout,
} from "../handlers/userHandler/userHandler";
import { auth } from "../middleware/auth/auth";
import {
  loginUserJoi,
  RegisterUserJoi,
  changePasswordJoi,
} from "../utils/joi-validator";
import { sendemailTokenJoi } from "../utils/joi-validator/schema";
import { updateProfile } from "../utils/multer/multer";
import { paymentMethod } from "../handlers/paymentHandler";
export const usersRoute = express.Router();

/**
 * @openapi
 * '/api/user/signup':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

usersRoute.post("/signup", RegisterUserJoi, Register);

/**
 * @openapi
 * '/api/user/signin':
 *  post:
 *     tags:
 *     - User
 *     summary: Log in a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateLoginInput'
 *     responses:
 *      200:
 *        description: Success
 */

usersRoute.post("/signin", loginUserJoi, signin);

/**
 * @openapi
 * '/api/user/update':
 *  patch:
 *     tags:
 *     - User
 *     summary: Log in a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *      200:
 *        description: Successful Update
 */
usersRoute.patch("/update", updateProfile.single("profileImage"), auth, update);
usersRoute.post("/resetpassword", sendemailTokenJoi, requestPassword);
usersRoute.patch("/verify", verifyUser);
usersRoute.post("/changepassword", changePasswordJoi, changepassword);
usersRoute.get("/get-user", auth, getUser);
usersRoute.post("/paystack-response", auth, paymentMethod);
usersRoute.get("/logout", auth, logout);
