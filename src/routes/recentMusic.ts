import express from "express";
import { auth } from "../middleware/auth/auth";
import { CreatePlayedMusic, DisplayPlayedMusic } from "../handlers/recentMusic";

export const playedMusicRoute = express.Router();

playedMusicRoute.post("/create-music/:id", auth, CreatePlayedMusic);

playedMusicRoute.get("/get-music",  auth, DisplayPlayedMusic);