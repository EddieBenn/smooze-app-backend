import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { GeneratePassword,GenerateSalt, GenerateSignature, validatePassword, verifySignature } from "../auth-utils"
// import { GenerateSalt, GeneratePassword } from "../auth-utils";

const [password, invalidData] = ["1234abcd","invalidPassword"]
const payload =  {
    payload:"payload",
    password,
}
// let salt:string,salt2:string,hashedPassword2:string,hashedPassword:string;
let salt:string,hashedPassword:string, salt2:string, isValidPassword:boolean, isNotValidPassword:boolean;
let hashedPassword2:string, signature:string, isValidSignature:JwtPayload;

beforeAll(async() => {
    salt = await GenerateSalt()
    salt2 = await GenerateSalt()
    hashedPassword = await GeneratePassword(password, salt)
    hashedPassword2 = await GeneratePassword(password, salt2)
    isValidPassword = await validatePassword(password, hashedPassword, salt);
    isNotValidPassword = await validatePassword(invalidData, hashedPassword, salt);
    signature= await GenerateSignature(payload);

    isValidSignature = await verifySignature(signature);
    // isNotValidSignature = await verifySignature(invalidData);
  });

describe("test Generate Salt function", ()=>{
    test("should generate salt", ()=>{
        expect(salt).toBeDefined()
    })

    test("should generate different random salts", async()=>{
        expect(salt).not.toBe(salt2)
    })

})

describe("test Generate Password function", ()=>{
    test("should generate password", ()=>{
        expect(hashedPassword).toBeDefined()
    })

    test("should generate different random passwords", async()=>{
        expect(hashedPassword).not.toBe(hashedPassword2)
    })

})

describe("test Validate Password function", ()=>{
    test("should validate correct password and salt", ()=>{
        expect(isValidPassword).toBe(true)
    })

    test("should not validate incorrect entered password", async()=>{
        expect(isNotValidPassword).toBe(false)
    })

    test("should not validate incorrect entered salt", async()=>{
        expect.assertions(1);
        try{
            await validatePassword(password, hashedPassword, invalidData);
        }
        catch(err:any){
            expect(err.message).toBe("Invalid salt. Salt must be in the form of: $Vers$log2(NumRounds)$saltvalue")
        }
    })
})

describe("test Generate Signature function", ()=>{
    test("should generate signature", ()=>{
        expect(signature).toBeDefined()
    })

})

describe("test Verify Signature function", ()=>{
    test("should verify correct signature", ()=>{
        expect(isValidSignature).toBeDefined()
    })

    test("should not verify incorrect signature", async()=>{
            expect.assertions(1);
            try{
                await verifySignature(invalidData);
            }
            catch(err){
                expect(err).toBeInstanceOf(JsonWebTokenError)
            }
    })
})