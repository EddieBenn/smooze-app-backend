import { Response, Request, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as UUID } from "uuid";
// import { UserAttributes } from "../../interface";
import { ArtistInstance, MusicInstance,  } from "../../model";

/* ==========================   CREATE ARTIST  =============================. */

export const CreateArtist = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, instagramUrl, twitterUrl } = req.body;
    // const id = req.user.id;
    let uuidartist = UUID();

    //   FIND ID EXIST
    // const authorizer = await UserInstance.findOne({
    //   where: { id: id },
    // }) as unknown as UserAttributes

    //   CHECK IF THE ID IS FOR AN EXISTING ADMIN
    // if (authorizer.role === "admin") {
    let artist = await ArtistInstance.create({
      id: uuidartist,
      name,
      instagramUrl,
      twitterUrl,
      imageUrl: req.file.path,
    });
    if (artist) {
      return res.status(201).json({
        message: "Artist Created Successfully",
        artist,
      });
    }
    return res.status(400).json({
      Error: "Error Occured",
    });
    // }
    // return res.status(400).json({
    //   Error: "Unauthorised",
    // });
  } catch (err) {
    next(err);
  }
};

/* ==========================   GET ARTISTS  =============================. */

export const GetAllArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let artists = await ArtistInstance.findAll({ });
      return res.status(201).json({
        artists,
      });
  } catch (err) {
    next(err);
  }
};

/* ==========================   GET ARTIST  =============================. */

export const GetArtist = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
        let id = req.params.id

      let artist = await ArtistInstance.findByPk(id,{
     include: [
          {
            model: MusicInstance,
            as: "music",
            attributes: [
                "id",
                "imageUrl",
                "songUrl",
                "title",
                "artist",
                "genreId",
                "song_duration",
            ],
          },
        ],
      });
        return res.status(201).json({
          artist,
        });
    } catch (err) {
      next(err);
    }
  };