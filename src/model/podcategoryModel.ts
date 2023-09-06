import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { podCategoryAttributes } from "../interface/podCategoryAttribute";
import { PodcastInstance } from "./podcastModel";

export class PodcategoryInstance extends Model<podCategoryAttributes> {}
PodcategoryInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    categoryImage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "podcastCategory",
  }
);
PodcategoryInstance.hasMany(PodcastInstance, {
  foreignKey: "category",
  as: "podcast",
});
PodcastInstance.belongsTo(PodcategoryInstance, {
  foreignKey: "category",
  as: "podcastCategory",
});
//{ foreignKey: 'category', as:"Category" }
