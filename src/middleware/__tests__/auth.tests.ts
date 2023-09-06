import supertest from "supertest"
import { GenerateSignature } from "../../utils/auth-utils";
import { UserInstance } from '../../model/userModel'
import {v4 as UUID} from 'uuid'
import app from "../../server"
import { auth } from "../auth/auth";
import { Response } from "express-serve-static-core";
import { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";

const email = "SMOOZE@gmail.com"
const id1=UUID()
const id2=UUID()
const id3=UUID()
let request:supertest.SuperTest<supertest.Test> = supertest(app)
let token :string|null;
let adminToken :string|null;
export const testUser =   {
    id:id2,
    password:"1234abcd",
    salt:"hello",
    userName:"Smooze",
    is_premium:false,
    firstName:"SMOOZE",
    lastName:"SMOOZE",
    email,
    country:"Nigeria",
    gender:"male",
    verified:true,
}

beforeAll(async()=>{
    try{
    await UserInstance.bulkCreate(
        [{
        id:id1,
        password:"1234abcd",
        salt:"hello",
        userName:"unverified",
        is_premium:false,
        firstName:"SMOOZE",
        lastName:"SMOOZE",
        email:"unverifiedUser@gmail.com",
        country:"Nigeria",
        gender:"male",
        verified:false,
    },
  testUser,
    {
        id:id3,
        password:"1234abcd",
        salt:"hello",
        userName:"Smoozeadmin",
        is_premium:false,
        firstName:"SMOOZE",
        lastName:"SMOOZE",
        email:"smoozeadmintest@gmail.com",
        country:"Nigeria",
        gender:"male",
        verified:true,
        role:"admin"
    }
])
}
catch(err:any){
    console.log(err)
}
})

afterAll(async()=>{
    await UserInstance.destroy({ where: { email:[email, "unverifiedUser@gmail.com","smoozeadmintest@gmail.com"] } });
})

describe("auth middleware integration tests",()=>{
    const exec = () => {
        return request
        .patch('/api/user/update')
        .set("Authorization", `Bearer ${token}`)
        .trustLocalhost(true)
        .send({ 
            firstName:"SMOOZE",
            lastName:"SMOOZE",
            email:"SMOOZE@gmail.com",
            country:"Nigeria",
            gender:"male"
        })
    }

    const execNoToken = () => {
        return request
        .patch('/api/user/update')
        .trustLocalhost(true)
        .send({ 
            firstName:"SMOOZE",
            lastName:"SMOOZE",
            email:"SMOOZE@gmail.com",
            country:"Nigeria",
            gender:"male"
        })
    }
    it("should return 400 if token is not specified", async()=>{
        const response = await execNoToken();
        expect(response.status).toBe(400)
    })

    it("should return 400 if token is incorrect", async()=>{
        token = ""
        const response = await exec();
        expect(response.status).toBe(400)
        expect(response.body.error).toBe("jwt must be provided")

    })

    it("should return 400 if token is correct but user is invalid", async()=>{
        const response = await exec();
        expect(response.status).toBe(400)
        expect(response.body.error).toBe("jwt must be provided")

    })

    it("should return 400 if token is correct and user is valid but user is not verified", async()=>{
        token = await GenerateSignature({email:'unverifiedUser@gmail.com',id:id1,verified:false,isLoggedIn: true});
        const response = await exec();
        expect(response.status).toBe(400)
        expect(response.body.error).toBe("Account Not Activated")
    })

    it("should return 200 if token is correct and user is valid", async()=>{
        token = await GenerateSignature({email:'SMOOZE@gmail.com',id:id2,verified:false,isLoggedIn: true});
        const response = await exec();
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("You have successfully updated your profile")
    })
})

describe("admin auth middleware integration tests",()=>{
    const exec = () => {
        return request
        .patch('/api/admin/update')
        .set("Authorization", `Bearer ${adminToken}`)
        .trustLocalhost(true)
        .send({ 
            firstName:"SMOOZE",
            lastName:"SMOOZE",
            email:"SMOOZE@gmail.com",
            country:"Nigeria",
            gender:"male"
        })
    }

    const execNoToken = () => {
        return request
        .patch('/api/admin/update')
        .trustLocalhost(true)
        .send({ 
            firstName:"SMOOZE",
            lastName:"SMOOZE",
            email:"SMOOZE@gmail.com",
            country:"Nigeria",
            gender:"male"
        })
    }
    it("should return 400 if token is not specified", async()=>{
        const response = await execNoToken();
        expect(response.status).toBe(400)
    })

    it("should return 400 if token is incorrect", async()=>{
        token = ""
        const response = await exec();
        expect(response.status).toBe(400)
        expect(response.body.error).toBe("jwt must be provided")

    })

    it("should return 400 if token is correct but user is invalid", async()=>{
        const response = await exec();
        expect(response.status).toBe(400)
        expect(response.body.error).toBe("jwt must be provided")

    })

    it("should return 400 if token is correct and user is valid but user is not an admin", async()=>{
        token = await GenerateSignature({email,id:id2, verified:true, isLoggedIn: true});
        const response = await exec();
        expect(response.status).toBe(400)
        expect(response.body.error).toBe("You are not an admin")
    })

    it("should return 200 if token is correct and user is an admin", async()=>{
        token = await GenerateSignature({email:'smoozeadmintest@gmail.com',id:id3,verified:true,isLoggedIn: true});
        const response = await exec();
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("You have successfully updated the user profile")
    })
})

describe("auth middleware unit tests",()=>{

    let req: Partial<JwtPayload>;
    let res: Partial<Response>;
    let next: NextFunction = jest.fn();
  
    beforeEach(() => {
      req = {};
      res = {
        json: jest.fn(),
      };
    });
    it("should call next function with no arguments if token is correct and verified", async()=>{
        token = await GenerateSignature({email,id:id2,verified:true,isLoggedIn: true});
        console.log(token)
        req = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        res = {}
        next = jest.fn()

        auth(req as JwtPayload, res as Response, next)
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith();
        expect(req.user).toBeDefined();
    })
    it("should call next with error if user is not verified", async()=>{
        token = await GenerateSignature({email:'unverified@gmail.com',id:id1,verified:true,isLoggedIn: true});
        req = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        res = {}
        next = jest.fn()

        auth(req as JwtPayload, res as Response, next)
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith({ code: 400, message: expect.any(String)  });

    })

    it("should call next with error if user does not exist", async()=>{
        token = await GenerateSignature({email:'unverified@gmail.com',id:"1234",verified:true,isLoggedIn: true});
        req = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        res = {}
        next = jest.fn()

        auth(req as JwtPayload, res as Response, next)
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith({ code: 400, message: expect.any(String) });


    })
})


// describe("admin auth middleware unit tests",()=>{

//     let req: Partial<JwtPayload>;
//     let res: Partial<Response>;
//     let next: NextFunction = jest.fn();
  
//     beforeEach(() => {
//       req = {};
//       res = {
//         json: jest.fn(),
//       };
//     });
//     it("should call next function with no arguments if user is an admin", async()=>{
//         token = await GenerateSignature({email,id:id3,verified:true,isLoggedIn: true});
//         console.log(token)
//         req = {
//             headers:{
//                 Authorization: `Bearer ${token}`
//             }
//         }
//         res = {}
//         next = jest.fn()

//         adminauth(req as JwtPayload, res as Response, next)
//         expect(next).toBeCalledTimes(1);
//         expect(next).toBeCalledWith();
// expect(req.user).toBeDefined()
//     })
//     it("should call next with error if user is not an admin", async()=>{
//         token = await GenerateSignature({email:'unverified@gmail.com',id:id1,verified:true,isLoggedIn: true});
//         req = {
//             headers:{
//                 Authorization: `Bearer ${token}`
//             }
//         }
//         res = {}
//         next = jest.fn()

//         adminauth(req as JwtPayload, res as Response, next)
//         expect(next).toBeCalledTimes(1);
//         expect(next).toBeCalledWith({ code: 400, message: "Unauthorised" });

//     })

// })