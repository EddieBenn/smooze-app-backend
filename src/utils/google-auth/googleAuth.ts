import { Application } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as UUID } from "uuid";
import config from "../../config";
import { UserInstance } from "../../model";
import { UserAttributes, UserPayload } from "../../interface";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
} from "../auth-utils";
export const googleoAuthentry = async (app: Application) => {
  const client = new OAuth2Client({
    clientId: config.GOOGLE_CLIENT_ID as string,
    clientSecret: config.GOOGLE_CLIENT_SECRET as string,
    redirectUri: config.GOOGLE_CALLBACK_URL as string,
  });
  app.get("/auth/google", (req, res) => {
    try {
      const redirect_uri =
        config.GOOGLE_CALLBACK_URL || (config.GOOGLE_CALLBACK_URL as string);
      const authUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
        prompt: "consent",
        redirect_uri,
      });
      res.redirect(authUrl);
    } catch (error) {
      res.redirect(`${config.FRONTEND_BASE_URL}/auth/social/?token=error`);
    }
  });

  app.get("/auth/google/callback", async (req: any, res: any, done) => {
    try {
      const { code } = req.query;
      const { tokens } = await client.getToken(code);
      client.setCredentials(tokens);
      const user = await client.credentials;
      const { id_token } = user;

      const userDataReal = jwt.decode(id_token as string) as JwtPayload;

      const { picture, email, sub, given_name, email_verified } = JSON.parse(
        JSON.stringify(userDataReal)
      ) as any;
      let userExist = (await UserInstance.findOne({
        where: {
          email: email,
        },
      })) as unknown as UserAttributes;
      if (!userExist) {
        const salt = await GenerateSalt();
        const Gen_password = await GeneratePassword(given_name, salt);
        const uuiduser = UUID();
        let createdUser = (await UserInstance.create({
          id: uuiduser,
          salt,
          email,
          password: Gen_password,
          profileImage: picture,
          googleId: sub,
          userName: given_name,
          verified: email_verified,
          is_premium: false,
          isLoggedIn: true,
          role: "user",
        })) as JwtPayload;

        const token: any = (await GenerateSignature({
          id: createdUser.id,
          email: createdUser.email,
          verified: createdUser.verified,
          isLoggedIn: createdUser.isLoggedIn,
          role: createdUser.role,
          is_premium: createdUser.is_premium,
        })) as unknown as UserPayload;
        // res.json(token);
        res.redirect(`${config.FRONTEND_BASE_URL}/auth/social/?token=${token}`);
      } else {
        //update the exp aand logedIn
        //update the logged in property
        (await UserInstance.update(
          {
            isLoggedIn: true,
            verified: true,
          },

          {
            where: {
              googleId: sub,
            },
            returning: true,
          }
        )) as unknown as UserPayload | UserAttributes | any;

        const loggedinUser = (await UserInstance.findOne({
          where: {
            googleId: sub,
          },
        })) as unknown as UserAttributes;
        const payload: UserPayload = {
          id: loggedinUser.id,
          email: loggedinUser.email,
          verified: loggedinUser.verified,
          isLoggedIn: loggedinUser.isLoggedIn,
          role: loggedinUser.role,
          is_premium: loggedinUser.is_premium,
        };
        const token = await GenerateSignature(payload);

        return res.redirect(
          `${config.FRONTEND_BASE_URL}/auth/social/?token=${token}`
        );
      }
    } catch (error) {
      res.redirect(`${config.FRONTEND_BASE_URL}/auth/social/?token=error`);
    }
  });
};
