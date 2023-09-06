import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { musicAttributes } from "../interface/musicAttributes";

export class MusicInstance extends Model<musicAttributes> {}
MusicInstance.init(
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
    creatorId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genreId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "music",
  }
);
