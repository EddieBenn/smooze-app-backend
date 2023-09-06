import request from 'supertest';
import app from "../../server"


describe("valid playlist routes tests",()=>{

    it('DELETE /api/playlist/delete/1234 ', async ()=>{
        const{ statusCode } = await request(app).patch("/api/playlist/delete/1234")
        expect(statusCode).not.toEqual(404);
    })

    it('PUT /api/playlist/update/1234 ', async ()=>{
        const{ statusCode } = await request(app).get("/api/playlist/update/1234")
        expect(statusCode).not.toEqual(404);
    })

    it('POST /api/playlist/create ', async ()=>{
        const{ statusCode } = await request(app).post("/api/playlist/create")
        expect(statusCode).not.toEqual(404);
    })


    it('GET /api/playlist ', async ()=>{
        const{ statusCode } = await request(app).get("/api/playlist")
        expect(statusCode).not.toEqual(404);
    })

})
