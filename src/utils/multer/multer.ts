import multer from "multer";

const cloudinary = require("cloudinary").v2;

import { CloudinaryStorage } from "multer-storage-cloudinary";
import config from "../../config";




cloudinary.config({
  cloud_name: config.CLOUD_NAME,
  api_key: config.CLOUD_API_KEY,
  api_secret: config.CLOUD_API_SECRET,
});



const updateprofile = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "UPDATESTORAGE",
      resource_type: "auto",
    };
  },
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "ADMIINMUSIC",
      resource_type: "auto",
    };
  },
});



const musicstorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      resource_type: "auto",
      folder: "PREMUIUMAPPMUSIC",
    };
  },
});

const genrestorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "GENREIMAGE",
      resource_type: "auto",
    };
  },
});

const podcaststorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => {
    return {
      resource_type: "auto",
      folder: "SMOOVEPODCAST",
    };
  },
});
const podcastCatstorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "PODCASTCATEGORYIMAGE",
      resource_type: "auto",
    };
  },
});

export const updateProfile = multer({ storage: updateprofile });
export const podcastUpload = multer({ storage: podcaststorage });
export const genreUpload = multer({ storage: genrestorage });
export const musicUpload = multer({ storage: musicstorage });
export const upload = multer({ storage: storage });
export const podcastCatUpload = multer({ storage: podcastCatstorage });




