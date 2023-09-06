import { profileImgConfig, musicConfig } from "../multer/multer";

describe("multer configurations should be accurate", ()=>{
    test("expect music config to be accurate", ()=>{
        const {format, folder} = musicConfig
        expect(format).toBe("mp3")
        expect(folder).toBe("SMOOVEAPPMUSIC")
    })

    test("expect profile config folder to be SMOOVEAPP", ()=>{
        const { folder} = profileImgConfig
        expect(folder).toBe("SMOOVEAPP")
    })
})