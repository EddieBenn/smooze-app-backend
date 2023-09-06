import request from 'supertest';
import app from "../../../server"
import { UserInstance } from '../../../model';
import { testUser } from '../../../middleware/__tests__/auth.tests';
import { GenerateSalt, GenerateSignature } from '../../../utils/auth-utils';

const user = {
    email:"smooze@gmail.com",
    userName:"smooze",
    password:"1234abcd",
    gender:"male",
    date_birth:"30-04-1982"
}
let token:string;
beforeAll(async()=>{
    await UserInstance.create(testUser)
    token = await GenerateSignature({email:testUser.email, id:testUser.id, verified:true, isLoggedIn:true})
})
afterAll(async()=>{
    await UserInstance.destroy({where: {id:testUser.id}})
    await UserInstance.destroy({where: {email:user.email}})
})
describe("/api/user/login tests",()=>{

    it('should not login unregistered users', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/login")
        .send({
            email:"smooze@unregistedemail.com",
            password:user.password,
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })

    it('should not login without email', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/login")
        .send({
            password:user.password,
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })

    it('should not login without password', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/login")
        .send({
            email:"smooze@unregistedemail.com",
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })

    it('should not login unverified users', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/login")
        .send({
            email:user.email,
            password:user.password,
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })
    
    it('should login registered users successfully', async ()=>{
        await UserInstance.create(testUser)
        const{ statusCode, body } = await request(app)
        .post("/api/user/login")
        .send({
            email:testUser.email,
            password:testUser.password,
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 200,
            "message": "Login successful"
        }));
    })
})

describe("/api/user/signup tests",()=>{
    it('should not register without email', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/signup")
        .send({
            password:user.password,
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })

    it('should not register invalid data', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/signup")
        .send({
            email:user.email,
            password:user.password,
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })
    
    it('should register user with correct data successfully', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/signup")
        .send(user)
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 200,
            "message": "Login successful"
        }));
    })
})

describe("/api/user/update tests",()=>{

    it('should not update if no data is provided', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/update")
        .set("Authorization", `Bearer ${token}`)
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400
        }));
    })

    it('should update if one data is provided', async ()=>{
        UserInstance.create(testUser)
        token = await GenerateSignature({email:testUser.email, id:testUser.id, verified:true, isLoggedIn:true})
        const{ statusCode, body } = await request(app)
        .post("/api/user/update")
        .set("Authorization", `Bearer ${token}`)
        .send({
            email:user.email
        })
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 400,
            "error": "Login successful"
        }));
    })
    
    it('should update if all data is provided', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/signup")
        .set("Authorization", `Bearer ${token}`)
        .send(user)
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 200,
            "message": "Login successful"
        }));
    })

    it('should not update if token is not provided or user is not verified', async ()=>{
        let{ statusCode, body } = await request(app)
        .post("/api/user/signup")
        .send(user)
        expect(statusCode).toEqual(404);
        expect(body).toEqual(expect.objectContaining({
            "code": 200,
            "message": "Login successful"
        }));

        // { statusCode, body } = await request(app)
        // .post("/api/user/signup")
        // .send(user)
        // expect(statusCode).toEqual(404);
        // expect(body).toEqual(expect.objectContaining({
        //     "code": 200,
        //     "message": "Login successful"
        // }));
    })
})

describe("/api/user/restpassword tests",()=>{

    it('should not send token if user is not registered', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/restpassword")
        .send({email:"fakeuser@email.com"})
        expect(statusCode).toEqual(401);
        expect(body).toEqual(expect.objectContaining({
            "code": 401,
            "message":"you are not registered"
        }));
    })

    it('should send token email but not in response to  if user is registered', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/restpassword")
        .send({email:testUser.email})
        expect(statusCode).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            "code": 200,
            message: "Check Your Email to Continue !!"
        }));
    })
})
// id: user.id,
// email,
// otp,

describe("/api/user/changepassword tests",()=>{
    const userWithOtp={...testUser, otp:""};
    let resetPwdToken = ""
    let fakeToken = ""
    beforeAll(async()=>{
        userWithOtp.otp = await GenerateSalt()
        await UserInstance.create(testUser)
        resetPwdToken = await GenerateSignature({id:testUser.id, email:testUser.email, otp:userWithOtp.otp})
        fakeToken = await GenerateSignature({id:"1234", email:"fake@gmail.com", otp:"1234"})
    })

    afterAll(async()=>{
        await UserInstance.destroy({where: {id:userWithOtp.id}})
    })

    it('should not change password if token is not valid', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/changepassword")
        .send({token:fakeToken,password:"1234"})

        const { statusCode:statusCode2, body:body2 } = await request(app)
        .post("/api/user/changepassword")
        .send({token:"wrontoken",password:"1234"})

        expect(statusCode).toEqual(401);
        expect(body).toEqual(expect.objectContaining({
            "code": 401,
            "message":"you are not registered"
        }));

        expect(statusCode2).toEqual(401);
        expect(body2).toEqual(expect.objectContaining({
            "code": 401,
            "message":"you are not registered"
        }));
    })

    it('should not change password if token is not specified', async ()=>{
        const{ statusCode, body } = await request(app)
        .post("/api/user/changepassword")
        .send({token:"",passowrd:"1234"})
        expect(statusCode).toEqual(401);
        expect(body).toEqual(expect.objectContaining({
            "code": 401,
            "message":"you are not registered"
        }));
    })

    it('should change password if user is registered and token is correct and should be able to log in after changing password', async ()=>{
        const newPassword = "12345678"
        const{ statusCode, body } = await request(app)
        .post("/api/user/restpassword")
        .send({token:resetPwdToken,password:newPassword})
        const isLoggedIn = await request(app)
        .post("/api/user/signin")
        .send({email:userWithOtp.email, password:newPassword})

        expect(statusCode).toEqual(200);
        expect(body).toEqual(expect.objectContaining({
            "code": 200,
            message: "password updated successfully"
        }));
        expect(isLoggedIn.status).toBe(200)
    })
})
