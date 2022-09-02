var express = require('express')
var passport = require('passport')
var localStrategy = require('passport-local')
var bcrypt = require('bcrypt')
const adminProfile= require ("../schema/admin-account");


passport.use(new LocalStrategy(function verify(email, pwd, cb) {
    createPost.findOne({email:email}).lean()
    .then((result)=> {return cb(null, false, { message: 'Incorrect username or password.' }) })
    .catch((err) => {return cb(err) })

    // db.get('SELECT rowid AS id, * FROM users WHERE username = ?', [ username ], function(err, row) {
    //   if (err) { return cb(err); }
    //   if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
  
    //   crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    //     if (err) { return cb(err); }
    //     if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
    //       return cb(null, false, { message: 'Incorrect username or password.' });
    //     }
    //     return cb(null, row);
    //   });
    // });
  }));

  router.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));