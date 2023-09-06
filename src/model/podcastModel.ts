import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { podcastAttributes } from "../interface/podcastAttributes";

export class PodcastInstance extends Model<podcastAttributes> {}
PodcastInstance.init(
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
    episodeUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "podcast",
  }
);
