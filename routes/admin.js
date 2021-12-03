var express = require('express');
var router = express.Router();
const {check, validationResult}= require("express-validator");
const mongoose = require ('mongoose');
const createPost = require ("../schema/create-post");
const multer = require('multer');

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

module.exports = router;
