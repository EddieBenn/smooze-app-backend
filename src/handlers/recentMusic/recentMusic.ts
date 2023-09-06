import { Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { v4 as UUID } from "uuid";
// import { musicAttributes } from "../../interface/musicAttributes";
// import { RecentMusicAttributes } from "../../interface/RecentMusicAttribute";
// import { musicAttributes, RecentMusicAttributes } from "../../interface";
import { PlayedMusicInstance,  } from "../../model";
import { MusicInstance } from "../../model/musicModel";

/* ==========================   CREATE PLAYED MUSIC  =============================. */

export const CreatePlayedMusic = async (
  req: JwtPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const songId = req.params.id
    const userId = req.user.id
    const recentlyPlayed = await PlayedMusicInstance.findOne({where:{songId, userId }})
    console.log('rcent',recentlyPlayed)
    if(recentlyPlayed){
      console.log('recent played music')
      recentlyPlayed.changed('updatedAt', true)
      recentlyPlayed.updatedAt = new Date()

      const result = await recentlyPlayed.save()
      console.log('result', result)
      return res.status(200).json({
        message: "Music added succesfully",
        recentlyPlayed:result})
    }
    const newlyPlayed = await PlayedMusicInstance.create({
      id: UUID(),
      songId,
      userId,
    }) 
    return res.status(201).json({
        message: "Music added to recently played music",
        recentlyPlayed:newlyPlayed
    })
  } catch (err) {
    next(err);
  }
};

/* ==========================   DISPLAY PLAYED MUSIC  =============================. */

export const DisplayPlayedMusic = async (
    req: JwtPayload,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const recentlyPlayedSongs = await PlayedMusicInstance.findAll({ where:{userId:req.user.id},
            order: [['updatedAt', 'DESC']],
            limit: 6,
            include: MusicInstance
          });
          return res.status(200).json({
            recentlyPlayedSongs
          })
    } catch (err) {
      next(err);
    }
  };