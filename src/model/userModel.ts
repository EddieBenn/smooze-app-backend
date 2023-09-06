import { DataTypes, Model } from "sequelize";
import { db } from "../config/db";
import { UserAttributes } from "../interface/UserAttributes";
import { MusicInstance } from "./musicModel";
import { PlaylistInstance } from "./playlistModel";
export class UserInstance extends Model<UserAttributes> {
  static patch(
    arg0: { is_premium: boolean },
    arg1: { where: { id: any } }
  ): unknown {
    throw new Error("Method not implemented.");
  }
}

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - email
 *        - userName
 *        - gender
 *        - date_birth
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: omo@yahoo.com
 *        userName:
 *          type: string
 *          default: omo ati
 *        gender:
 *          type: string
 *          default: male
 *        date_birth:
 *          type: string
 *          default: 7/2/1998
 *        password:
 *          type: string
 *          default: omo12345678
 *    CreateUserResponse:
 *      type: object
 *      required:
 *        - email
 *        - userName
 *        - gender
 *        - date_birth
 *        - password
 *      properties:
 *        email:
 *          type: string
 *        userName:
 *          type: string
 *        gender:
 *          type: string
 *        date_birth:
 *          type: string
 *        _id:
 *          type: string
 *    CreateLoginInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *    UpdateUserInput:
 *      type: object
 *      properties:
 *        firstName:
 *          type: string
 *        profileImage:
 *          type: any
 *        lastName:
 *          type: string
 *        address:
 *          type: string
 *        country:
 *          type: string
 *        password:
 *          type: string
 */

UserInstance.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Email is required",
        },
        isEmail: {
          msg: "Email is invalid",
        },
      },
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required",
        },
        notEmpty: {
          msg: "Password is required",
        },
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_birth: {
      type: DataTypes.DATE,
    },
    isAceptedPrivacy: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    day: {
      type: DataTypes.STRING,
    },
    month: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.STRING,
    },
    lng: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Verification status is required",
        },
        notEmpty: {
          msg: "user not verified",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING({ length: 1000 }),
      allowNull: true,
    },
    lan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isAceptedTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    socials: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    facebookId: {
      type: DataTypes.STRING,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    googleToken: {
      type: DataTypes.STRING,
    },
    faceBookToken: {
      type: DataTypes.STRING,
    },
    is_premium: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize: db,
    tableName: "user",
  }
);



  UserInstance.hasMany(MusicInstance,{
        foreignKey: "creatorId", as: "music"
    })
   
    MusicInstance.belongsTo(UserInstance,{
        foreignKey: "creatorId", as: 'user'
    })

    UserInstance.hasMany(PlaylistInstance,{
      foreignKey: "creatorId", as: "playlist"
  })
 
  PlaylistInstance.belongsTo(UserInstance,{
      foreignKey: "creatorId", as: 'user'
  })