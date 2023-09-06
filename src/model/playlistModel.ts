import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { playlistAttributes } from "../interface/playlistAttributes";

export class PlaylistInstance extends Model<playlistAttributes> {}
PlaylistInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    songUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    artistId: {
        type: DataTypes.UUID,
      },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genreId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "playlist",
  }
);
