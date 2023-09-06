import { testUser } from '../../middleware/__tests__/auth.tests';
import request from 'supertest';
import app from "../../server"


describe("valid user routes tests",()=>{
    
    it('POST /api/user/signin ', async ()=>{
        const{ statusCode } = await request(app).post("/api/user/signin")
        .send({email:testUser.email,password:testUser.password})
        expect(statusCode).not.toEqual(404);
    })

    it('POST /api/user/signup ', async ()=>{
        const{ statusCode } = await request(app).post("/api/user/signup")
        .send({email:testUser.email,password:testUser.password})
        expect(statusCode).not.toEqual(404);
    })


    it('PATCH /api/users/update ', async ()=>{
        const{ statusCode } = await request(app).patch("/api/user/update")
        .send(testUser)
        expect(statusCode).not.toEqual(404);
    })

    it('PATCH /api/user/get-user ', async ()=>{
        const{ statusCode } = await request(app).get("/api/user/get-user")
        expect(statusCode).not.toEqual(404);
    })

    it('POST /api/user/resetpassword ', async ()=>{
        const{ statusCode } = await request(app).post("/api/user/resetpassword")
        expect(statusCode).not.toEqual(404);
    })

    it('PATCH /api/user/verify', async ()=>{
        const{ statusCode } = await request(app).patch("/api/user/verify")
        expect(statusCode).not.toEqual(404);
    })

    it('GET /api/users/changepassword ', async ()=>{
        const{ statusCode } = await request(app).post("/api/user/changepassword")
        expect(statusCode).not.toEqual(404);
    })

})