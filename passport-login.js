
const passport = require('passport')
const passportLocal = require('passport-local')
const mongoose = require('mongoose');

const adminProfile = require("./schema/admin-account");
const bcrypt = require('bcrypt');



// This route processes the users data ans returns response
passport.use(new passportLocal.Strategy ({
  usernameField: 'useremail'
},  (useremail, pwd, done) =>{

  adminProfile.find({email:useremail}).lean()
  .then((result)=>{
    done(null, data[0]['email'])

     console.log(result)
  })
  .catch((err)=>{
    done(null, false,{message: 'Invalid request'})
      console.log('Not Found'+err)
  })

    // try{
    //   let data= await adminProfile.find({email:useremail}).lean()
    //   console.log(data[0])
    //   if(data[0].length > 0)
    //   {
    //     let pwd = await bcrypt.compare(pwd,data[0][password])
    //     if(pwd)
    //     {
    //     done(null, data)
    //   }}
    //   else{
    //     done(null, false,{message: 'Invalid request'})
    //   }
    // }
    // catch(error){
    //   done({error: 'Invalid request'})
    // }

}))


// serialize and deserialize add the users data to a creation which can be created and persistantly made available across app.
passport.serializeUser(function(user, cb) {
 
  process.nextTick(function(req,res) {
    cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  console.log(user)
  process.nextTick(function() {
    console.log(user)
    return cb(null, user);
  });
});