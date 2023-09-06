import { Router } from "express";
import { podcastCatUpload, podcastUpload } from "../utils/multer/multer";

import {
  createPodcast,
  getAllPodcast,
  getPodcastById,
  deletePodcast,
  updatePodcast,
} from "../handlers/podcastHandler";
import { auth } from "../middleware/auth/auth";
import { is_premium } from "../middleware/is_premium/is_premium";
import {
  creatPodcastCategory,
  getACategory,
  getAllCategories,
} from "../handlers/podCategoryHandler";

export const PodcastRoute = Router();

/**
 * @swagger
 * /api/podcast:
 *   get:
 *     description: Testing for get api
 *     responses:
 *       200:
 *         description: Returns hello podcast
 */

PodcastRoute.post(
  "/create",
  auth,
  is_premium,
  podcastUpload.fields([
    {
      name: "podcastFile",
    },
    { name: "imageFile" },
  ]),
  createPodcast
);
PodcastRoute.get("/podcasts", getAllPodcast);
PodcastRoute.get("/podcast/:id", getPodcastById);

PodcastRoute.get("/category/:category", getACategory);

PodcastRoute.post(
  "/creatPodcastCategory",
  podcastCatUpload.single("podCatImage"),
  creatPodcastCategory
);
PodcastRoute.get("/allpodcastcatetgory", getAllCategories);

PodcastRoute.patch("/update/:id", updatePodcast);
PodcastRoute.delete("/delete/:id", deletePodcast);
