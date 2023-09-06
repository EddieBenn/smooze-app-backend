import express from "express";
import { CreateArtist, GetAllArtist, GetArtist, } from "../handlers/artistHandler";
import { restrictToAdmin } from "../middleware/admin/admin";
import { auth } from "../middleware/auth/auth";
import { createArtistJoi, } from "../utils/joi-validator/schema";
import { upload } from "../utils/multer/multer";
// import { auth } from "../middleware/auth/auth";



export const artistRoute = express.Router();

artistRoute.post("/create-artist",  auth, restrictToAdmin, createArtistJoi, upload.single("imageUrl"),CreateArtist);

artistRoute.get("/get-all-artists",  GetAllArtist);

artistRoute.get("/get-artist/:id",  GetArtist);