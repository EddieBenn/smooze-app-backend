import express from "express";
import {
  AdminMusic,
  premium_create,
  getAllMusic,
} from "../handlers/musicHandler/musicHandler";
import { restrictToAdmin } from "../middleware/admin/admin";
// import { restrictToAdmin } from "../middleware/admin/admin";
// import { getAllMusic, premium_create } from "../handlers/musicHandler/musicHandler";
import { auth } from "../middleware/auth/auth";
import { is_premium } from "../middleware/is_premium/is_premium";
import { musicUpload, upload } from "../utils/multer/multer";

export const musicRouter = express.Router();
/**
 * @swagger
 * /api/music:
 *   get:
 *     description: Testing for get api
 *     responses:
 *       200:
 *         description: Returns hello music
 */

musicRouter.post(
  "/create-songs",
  auth,
  restrictToAdmin,
  upload.fields([{ name: "songFile" }, { name: "imageFile" }]),
  AdminMusic
);

musicRouter
  .get("/get_song", auth, getAllMusic)
  .post("/create", () => {})
  .post(
    "/prem_create",
    auth,
    is_premium,
    musicUpload.fields([{ name: "song_file" }, { name: "image_file" }]),

    premium_create
  )

  .put("/update/:id", () => {})
  .delete("/delete/:id", () => {});

export default musicRouter;
