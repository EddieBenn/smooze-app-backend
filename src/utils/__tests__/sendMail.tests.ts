import { sendEmail as Mailer } from "../notification"

describe("Email service test", ()=>{

    //commented out to save email credits
    // test("Should send an email successfully", async() =>{
    //     const sendMail = await Mailer('yinorhino@gmail.com',"Email test passed","<h1>Email test passed</h1>")
    //     const sent = sendMail?.response
    //     expect(sent).toContain("2.0.0 OK")
    // })

    test("Should throw error when subject", async() =>{
    expect.assertions(1);
      try {
        await Mailer('yinorhino@gmail.com',"","<h1>Email test passed</h1>")

    } catch (err:any) {
        const errorMessage = err?.message
        expect(errorMessage).toBe("subject not specified");
    }
    })

    test("Should throw error when html is not passed as argument", async() =>{
        expect.assertions(1);
        try {
            await Mailer('yinorhino@gmail.com',"Email test passed","")

        } catch (err:any) {
            const errorMessage = err?.message
            console.log(err.message)
            expect(errorMessage).toBe("html template not specified");
        }
    })

    test("Should throw error when to is not passed as argument", async() =>{
        expect.assertions(1);
        try {
            await Mailer("","Email test passed","<h1>Email test passed</h1>")

         } catch (err:any) {
             const errorMessage = err?.message
             console.log(err.message)
             expect(errorMessage).toBe("recipient(to) not specified");
         }
    })
})