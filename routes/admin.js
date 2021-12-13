var express = require('express');
var router = express.Router();
const {check, validationResult}= require("express-validator");
const mongoose = require ('mongoose');
const createPost = require ("../schema/create-post");
const multer = require('multer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const adminProfile= require ("../schema/admin-account");

const fileStorage= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/blogImages')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-'
    cb(null, uniqueSuffix + file.originalname)
  }

  
})

const upload = multer({storage:fileStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }})

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
  .get('/create-post', (req,res, next)=>{
    res.render('admin/create-post',{title:"Create Blog Post"})
  })
  .post('/create-post',upload.single('image'),
    check('title')
    .isLength({min:1})
    .withMessage('The title field is empty'),
    check('name')
    .isLength({min:1})
    .isAlpha('en-US', {ignore: '\s'})
    .withMessage('Name should be alphabeth'),
    check('content')
    .isLength({min:1})
    .withMessage('Post body is too short'),
   (req,res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('admin/create-post',{msg: errors.array()});
    }
    else{

      const postBody= req.body;
      const blogPost= new createPost({
        title: postBody.title,
        name: postBody.name,
        content : postBody.content,
        image : req.file.filename,
        status : 'Active',
        date_created: new Date()
      });
console.log(req.file.filename);
      blogPost.save()
      .then((result) => res.render('admin/create-post',{response:'Blog Post Published Successfully'}))
      .catch((err) => console.log (err))
    
  }
 
  }, (err,req, res,next)=> {
    res.render('admin/create-post',{imgmsg:err})
  })
  router
    .get('/all-post', (req, res, next)=>{
      const allblogpost= createPost.find().lean()
        .then((result) => res.render('admin/all-post',{title: 'All Post', data: result}))
        .catch((err)=> console.log(err));
      //console.log(allblogpost)
      
    })
    .post('/all-post', (req,res, next)=>{
      res.render('all-post',{title: 'All Post'})
    })


router.get('/add-news', function(req, res, next) {
  // res.send("hello world i am yours");
  res.render('admin/add-news');
});


//edit fields
router
  .get('/edit',(req,res)=>{
  createPost.findOne({_id:req.query.id}).lean()
  .then((result)=> {
    res.render('admin/edit',{data:result,title: "Edit Blog Post"})
  })
  .catch((err) => console.log(err))
  })
  .post('/edit', (req,res) => {
    createPost.updateOne({_id:req.body.id},{title:req.body.title,name:req.body.name,content:req.body.content},(err,result)=>{
      if(err)
        res.send(err)
      else
      res.render('admin/all-post',{response:{success:'Update Published Successfully'}})

     
    })
  })

  router
    .get('/create-account',(req,res)=>{
      res.render('admin/create-account',{title:'Create Admin Profile'});
      
    })
    .post('/create-account',(req,res) =>{
      console.log(req.body)

      if(req.body.pwd !== req.body.pwd2)
      {
        res.send("Password do not match")
      }
     

      else{
   const checkEmail= verifyemail(req.body.email)
   console.log("valid:" + checkEmail);
   if(checkEmail == true)
   {
     res.send("email available")
   }
   else
   {
        bcrypt.hash(req.body.pwd, 10)
          .then((result)=>{
            console.log(result)
            const adminProfileObj = new adminProfile({
              name: req.body.name,
              email: req.body.email,
              password: result,
              status: "Active",
              date_created: new Date()
      
            })

            adminProfileObj.save()
            .then((result) => res.render('admin/create-account',{response:{success: "Admin Profile Created"}}))
            .catch((err) => console.log(err))
          })
          .catch((err)=> { console.log(err)})    
    }}
      
    })
    router
    .get('/login',(req,res) =>{
      bcrypt.compare('1111111','$2b$10$T/EQC9ZLKLHjHvFByOqS0O5qrxueHygtkM9i4/3LBUmaqM7gzu9fC')
      .then((result) =>{ console.log(result)})
      .catch((err) => console.log(err))
     })

     function verifyemail(data)
     {
       console.log(data)
      adminProfile.findOne({email:data}).lean() 
        .then((result)=> {console.log('true' + result)})
        .catch((err)=> {return false})
     }

module.exports = router;
