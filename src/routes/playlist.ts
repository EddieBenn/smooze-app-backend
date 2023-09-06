import { Router } from "express";
import {
  addSongToPlaylist,
  getFlowSongs,
  getPlaylistSongs,
} from "../handlers/playlistHandler/playlistHandler";
import { auth } from "../middleware/auth/auth";
export const playlistRoute = Router();

/**
 * @swagger
 * /api/playlist:
 *   get:
 *     description: Testing for get api
 *     responses:
 *       200:
 *         description: Returns hello playlist
 */

playlistRoute
  .get("/getPlaylists", auth, getPlaylistSongs)
  .get("/flow", auth, getFlowSongs)
  .post("/addToPlaylist/:songId", auth, addSongToPlaylist);
