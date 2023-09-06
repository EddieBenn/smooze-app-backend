# node-live-project-backend-sq012

# clone the repo

# run yarn

requirement to create user:
{
    "email":"jon1fye@gmail.com",
    "userName":"johjffnqee",
    "password":"12ddd34",
    "date_birth":"03/3/1995",
    "gender":"male 
}
if you want to access the userSchema you have import  from src/model
if you want to access the inteface you have import  from src/interface

please for face booklogin text user this test users Details
facebook\_ email = "vtlibnjcki_1672249397@tfbnw.net"
facebook_password="blablablue1234"
both server should run on https

for google please request for developer test account as this cannot be auto generated


    =============================test-admin-user======================
    email: "admintest23@gmail.com",
    verified:true,
    userName:"adminuser2",
    password: await GeneratePassword("admin1234",salt),
    salt: salt,
    role:"admin",
    is_premium:true

    =========================test-db===================================
    LOCAL_DATABASE_USERNAME= "jxcffllw" 

    LOCAL_DATABASE_HOST= "mel.db.elephantsql.com" 

    LOCAL_DATABASE_DATABASE_NAME= "jxcffllw" 

    LOCAL_DATABASE_PASSWORD= "6zJahnp4PGQwIluWjHw7eDAcsaBrw_9l" 

====================create test admin====================
//   const createNewAdmin = async()=>{
//     const salt = await GenerateSalt()
//     await UserInstance.create({
//     id: require('uuid').v4(),
//     email: "admintest23@gmail.com",
//     verified:true,
//     userName:"adminuser2",
//     password: await GeneratePassword("admin1234",salt),
//     salt: salt,
//     role:"admin",
//     is_premium:true
//   })
// }