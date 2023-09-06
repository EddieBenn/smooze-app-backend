import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { RecentMusicAttributes } from "../interface/RecentMusicAttribute";
import { MusicInstance } from "./musicModel";
import { UserInstance } from "./userModel";

export class PlayedMusicInstance extends Model<RecentMusicAttributes> {
  updatedAt?: Date;
}
PlayedMusicInstance.init(
    {
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
        },
        userId:{
          type:DataTypes.UUID,
          allowNull:false,
        },
        songId:{
          type:DataTypes.UUID,
          allowNull: false
        }
    },
    {
        sequelize:db,
        tableName:"recentMusic",
    }
)

UserInstance.hasMany(PlayedMusicInstance,{
  foreignKey: "userId"
})

PlayedMusicInstance.belongsTo(UserInstance,{
  foreignKey: "userId"
})

MusicInstance.hasOne(PlayedMusicInstance,{
  foreignKey: "songId"
})
PlayedMusicInstance.belongsTo(MusicInstance,{
  foreignKey: "songId"
})

