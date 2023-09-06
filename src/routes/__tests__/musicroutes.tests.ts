import request from 'supertest';
import app from "../../server"


describe("valid music routes tests",()=>{

    it('DELETE /api/music/delete/1234 ', async ()=>{
        const{ statusCode } = await request(app).delete("/api/music/delete/1234")
        expect(statusCode).not.toEqual(404);
    })

    it('PUT /api/music/update/1234 ', async ()=>{
        const{ statusCode } = await request(app).put("/api/music/update/1234")
        expect(statusCode).not.toEqual(404);
    })

    it('POST /api/music/create ', async ()=>{
        const{ statusCode } = await request(app).post("/api/music/create")
        .send({})
        expect(statusCode).not.toEqual(404);
    })


    it('GET /api/music ', async ()=>{
        const{ statusCode } = await request(app).get("/api/music")
        expect(statusCode).not.toEqual(404);
    })

    it('GET /api/music/prem_create ', async ()=>{
        const{ statusCode } = await request(app).post("/api/music/prem_create")
        expect(statusCode).not.toEqual(404);
    })

})
