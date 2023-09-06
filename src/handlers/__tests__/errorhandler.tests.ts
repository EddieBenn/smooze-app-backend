// import { NextFunction, Request, Response } from "express";
// import { any } from "joi";
// import { JwtPayload } from "jsonwebtoken";
import { codeError } from "../errorHandler"


const errors = {
    404: "End Of Page",
    401: "Not Authorised",
    500: "Something Went Wronge",
    400: "",
  }

  describe('Error handler unit tests', () => { 

//     let req: Partial<Request>;
//     let res: Partial<Response>;
//     let next: NextFunction = jest.fn();
  
//     beforeEach(() => {
//       req = {};
//       res = {
//         status:{},
//         json: jest.fn(),
//       };
//     });
    it("should contain proper error codes", ()=>{
        expect(codeError).toEqual(expect.objectContaining(errors));
    })

//     it("Error handler should return error", async()=>{
//         let error= {code:400, message:"Error test"};
//         await errorHandler(error, req as Request, res as Response, next)
//         expect(res.status).toBe(error.code)
//         expect(res.json).toBe(error.message)
//     })

   })