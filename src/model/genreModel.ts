import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { genreAttributes } from "../interface/genreAttributes";
import { MusicInstance } from "./musicModel";
export class genreInstance extends Model<genreAttributes> {
    static findById(id: string) {
        throw new Error('Method not implemented.');
    }
    static find: any;
}

genreInstance.init(
    {
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        genreImage:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        sequelize:db,
        tableName:"genre"
    }
)

   genreInstance.hasMany(MusicInstance,{
        foreignKey: "genreId", as: 'music'
    })
   
    MusicInstance.belongsTo(genreInstance,{
        foreignKey: "genreId", as: 'genre'
    })