import { Response, NextFunction, Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as UUID } from "uuid";
import { musicAttributes } from "../../interface/musicAttributes";
import { UserInstance } from "../../model";
import { MusicInstance } from "../../model/musicModel";
import { ArtistInstance } from "../../model/artistModel";
import { genreInstance } from "../../model/genreModel";
import { UserAttributes } from "../../interface";
import { artistAttributes } from "../../interface/artistAttributes";
import { genreAttributes } from "../../interface/genreAttributes";
export const AdminMusic = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const getFileData = async () => {
      const { songFile, imageFile } = req.files;
      const dataPath = {
        imagePath: imageFile[0].path,
        songName: songFile[0].originalname,
        songPath: songFile[0].path,
      };
      return dataPath;
    };
    const { imagePath, songPath } = await getFileData();

    const musicId = UUID();
    const { title, artist, genreId } = req.body;

    const user = (await UserInstance.findOne({
      where: { email: req.user.email },
    })) as unknown as UserAttributes;
    console.log(2);

    if (!user) {
      return res.status(400).json({
        error: "You are not a registered user ",
      });
    }
    if (user.role === "admin") {
      const artistData = (await ArtistInstance.findOne({
        where: { id: artist },
      })) as unknown as artistAttributes;
      if (!artistData) {
        throw { code: 404, message: "Artist does not exist" };
      }

      const genreData = (await genreInstance.findOrCreate({
        where: { id: genreId },
      })) as unknown as genreAttributes;
      if (!genreData) {
        throw { code: 404, message: "genre does not exist" };
      }

      const music = (await MusicInstance.create({
        id: musicId,
        title,
        artistId: artist,
        artist: artistData.name,
        genreId,
        imageUrl: imagePath,
        songUrl: songPath,
        creatorId: user.id,
      })) as unknown as musicAttributes;

      return res.status(201).json({
        message: "Music created successfully",
        music,
        code: 201,
      });
    } else {
      throw { code: 401, message: "You are not an admin!" };
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const premium_create = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const getMusicData = async () => {
      const { song_file, image_file } = req.files;
      console.log(req.files, req.body);
      const data_path = {
        image_path: image_file[0].path,
        song_name: song_file[0].originalName,
        song_path: song_file[0].path,
      };
      return data_path;
    };

    const { image_path, song_path, song_name } = await getMusicData();
    console.log(image_path, song_path, song_name);

    const music_id = UUID();
    const { title, artistId, genreId, artist } = req.body as musicAttributes;
    const createMusic = (await MusicInstance.create({
      id: music_id,
      title,
      artistId,
      genreId,
      artist,
      imageUrl: image_path,
      songUrl: song_path,
      creatorId: req.user.id,
    })) as unknown as musicAttributes;

    res.status(201).json({
      message: "Music created successfully",
      createMusic,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "something went wrong",
    });
  }
};

export const getAllMusic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const songs = await MusicInstance.findAll();

    res.status(200).json({
      songs,
      code: 200,
      message: "you have succesfully received all songs",
    });
  } catch (error) {
    next(error);
  }
};


