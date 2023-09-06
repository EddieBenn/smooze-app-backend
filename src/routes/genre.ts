import express from "express";
import {addGenre, getAllGenres, getGenreById, editGenre, deleteGenre, getAllGenresLimit} from '../handlers/genreHandler'
import { restrictToAdmin } from "../middleware/admin/admin";
import { auth } from "../middleware/auth/auth";
import { genreUpload } from "../utils/multer/multer";


export const genreRouter = express.Router();
/**
 * @swagger
 * /api/genre:
 *   get:
 *     description: Testing for get api
 *     responses:
 *       200:
 *         description: Returns hello genre
 */


genreRouter.post("/addgenre", auth, restrictToAdmin,genreUpload.single('genreImage'), addGenre )
genreRouter.get("/genres", getAllGenres)
genreRouter.get("/genreslimited", getAllGenresLimit)
genreRouter.get("/genre/:id", getGenreById)
genreRouter.patch("/edit/:id", auth, restrictToAdmin, genreUpload.single('genreImage'), editGenre)
genreRouter.delete("/delete/:id", deleteGenre)
