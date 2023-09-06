import { welcomeEmail } from "../notification"

const [firstname, token] = ["smooze", "token"]

describe("Welcome email template function test",()=>{
    const htmlTemplate = welcomeEmail(firstname, token)
    test("expect template to be generated ", ()=>{
        expect(typeof htmlTemplate).toBe("string")
        expect(htmlTemplate.length).toBeGreaterThan(5)
    })

    test("expect template to contain exact token and firstname", ()=>{
        expect(htmlTemplate).toContain(token)
        expect(htmlTemplate).toContain(firstname)
    })

    test("expect function to throw error when firstname is not specified ", ()=>{
        expect.assertions(1);
        try {
            welcomeEmail("", token)
        } catch (err:any) {
            const errorMessage = err?.message
            expect(errorMessage).toBe("firstname is not specified");
        }
    })

    test("expect function to throw error when token is not specified ", ()=>{
        expect.assertions(1);
        try {
            welcomeEmail(firstname, "")
        } catch (err:any) {
            const errorMessage = err?.message
            expect(errorMessage).toBe("token is not specified");
        }
    })
})