var express = require('express');
var router = express.Router();
const { check, validationResult } = require("express-validator");
const mongoose = require('mongoose');
const createPost = require("../schema/create-post");
const multer = require('multer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
var passport = require('passport')
const auth= require('./auth')
var pass_local = require('../passport-login')
const adminProfile = require("../schema/admin-account");
const passportLocal = require('passport-local')



const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/blogImages')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-'
        cb(null, uniqueSuffix + file.originalname)
    }


})

const upload = multer({
    storage: fileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
})

/* GET users listing. */
router
    .get('/', function(req, res, next) {
        res.render('admin/dashboard');
    })
    .post('/', function(req, res, next) {
        res.render('admin/dashboard');
    })
router
    .get('/dashboard', function(req, res, next) {
        res.render('admin/dashboard');
    })
    .post('/dashboard', function(req, res, next) {
        res.render('admin/dashboard');
    })
router
    .get('/create-post', (req, res, next) => {
        res.render('admin/create-post', { title: "Create Blog Post" })
    })
    .post('/create-post', upload.single('image'),
        check('title')
        .isLength({ min: 1 })
        .withMessage('The title field is empty'),
        check('name')
        .isLength({ min: 1 })
        .isAlpha('en-US', { ignore: '\s' })
        .withMessage('Name should be alphabeth'),
        check('content')
        .isLength({ min: 1 })
        .withMessage('Post body is too short'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                res.render('admin/create-post', { msg: errors.array() });
            } else {

                const postBody = req.body;
                const blogPost = new createPost({
                    title: postBody.title,
                    name: postBody.name,
                    content: postBody.content,
                    image: req.file.filename,
                    status: 'Active',
                    date_created: new Date()
                });
                //console.log(req.file.filename);
                blogPost.save()
                    .then((result) => res.render('admin/create-post', { response: 'Blog Post Published Successfully' }))
                    .catch((err) => console.log(err))

            }

        }, (err, req, res, next) => {
            res.render('admin/create-post', { imgmsg: err })
        })
router
    .get('/all-post', (req, res, next) => {
        const msg = req.query.msg;
        const allblogpost = createPost.find().lean()
            .then((result) => res.render('admin/all-post', { title: 'All Post', success: msg, data: result }))
            .catch((err) => console.log(err));
        //console.log(allblogpost)

    })
    .post('/all-post', (req, res, next) => {
        res.render('all-post', { title: 'All Post' })
    })


router.get('/add-news', function(req, res, next) {
    // res.send("hello world i am yours");
    res.render('admin/add-news');
});


//edit fields
router
    .get('/edit/:id', (req, res) => {
        createPost.findOne({ _id: req.params.id }).lean()
            .then((result) => {
                res.render('admin/edit', { data: result, title: "Edit Blog Post" })
            })
            .catch((err) => console.log(err))
    })
    .post('/edit', (req, res) => {
        createPost.updateOne({ _id: req.body.id }, { title: req.body.title, name: req.body.name, content: req.body.content }, (err, result) => {
            if (err)
                res.send(err)
            else
                res.redirect('/admin/all-post?msg=Update Published Successfully')


        })
    })

router
    .get('/create-account', (req, res) => {
        res.render('admin/create-account', { title: 'Create Admin Profile' });

    })
    .post('/create-account', (req, res) => {
            console.log(req.body)

            if (req.body.pwd !== req.body.pwd2) {
                res.render('admin/create-account', { error: 'Password do not match' })
            } else {

                //  const checkEmail= async()=>{ await verifyemail(req.body.email); console.log(a)}
                //  console.log(checkEmail);

                //  if(checkEmail === true)
                //  {
                //    res.send("email available")
                //  }
                //  else
                //  {
                bcrypt.hash(req.body.pwd, 10)
                    .then((result) => {
                        const adminProfileObj = new adminProfile({
                            name: req.body.name,
                            email: req.body.email,
                            password: result,
                            status: "Active",
                            date_created: new Date()

                        })

                        adminProfileObj.save()
                            .then((result) => res.render('admin/create-account', { response: { success: "Admin Profile Created" } }))
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => { console.log(err) })
            }
        }

    )

    router
        .get('/all-account',async (req, res)=>{
            const msg=req.query.msg
            let data= await adminProfile.find().lean()
            console.log(data[0]['name'])
            res.render('admin/all-account',{title:'All Accounts',result:data,success:msg})
        })
        .get('/remove-account', (req, res)=>{
            adminProfile.deleteOne({_id:req.query.id})
            .then((result)=>{
                res.redirect('/admin/all-account?msg=Account Successfully Removed')
            })
            .catch((error)=> console.log(error))
            console.log(req.query.id)
        })
router
    .get('/delete/:id', (req, res) => {
        const id = req.params.id

        createPost.deleteOne({ _id: id })
            .then((result) => {
                res.redirect('/admin/all-post?msg=Deleted Successfully')
            })
            .catch((err) => console.log(err))



    });

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
router
    .get('/login', (req, res) => {
        res.render('admin/login', { title: "Admin Login" })
    })
    .post('/', 
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
        });


      

//      function verifyemail(model,data)
//      {
//       model.findOne({email:data}).lean()
//         .then((result)=> { 
//         })
//         .then((response) => { return true})
//         .catch((err)=> {return false})
//      }


//     const address = adminProfile.findOne({email:"admin@joose.com"})
//   .then((response) => response)
//   .then((user) => {
//     return user;
//   });

//   async function getdata(data)
//   { 
//     await adminProfile.findOne({email:data})
//   }

// const printAddress = async () => {
//   const a = await address;
//   return a;
// };

// let b;
// (async () => b = await printAddress())();
// console.log(b)

module.exports = router;