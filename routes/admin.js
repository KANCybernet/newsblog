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
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          // The standard secure default length for RSA keys is 2048 bits
          modulusLength: 2048,
        });

        const encryptedData = crypto.publicEncrypt(
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          // We convert the data string to a buffer using `Buffer.from`
          Buffer.from(req.body.pwd)
        );
res.send(encryptedData.toString("base64"));

        // bcrypt.hash(req.body.pwd, 10)
        //   .then((result)=>{
        //     console.log(result)
        //     const adminProfileObj = new adminProfile({
        //       name: req.body.name,
        //       email: req.body.email,
        //       password: result,
        //       status: "Active",
        //       date_created: new Date()
      
        //     })

        //     adminProfileObj.save()
        //     .then((result) => res.render('admin/create-account',{response:{success: "Admin Profile Created"}}))
        //     .catch((err) => console.log(err))
        //   })
        //   .catch((err)=> { console.log(err)})

         
    }
      
    })
    router
    .get('/login',(req,res) =>{

      const encryptedData = "hacx2UfIf2yMhPkzKzh0ffJWwHteiS5LE77HIFfjghe6PaF8uj8JciXbsNABtIfpC3L6fiyX6Ks/wXHF+CJZQp6ibiaq7OysxLyXU8scFvgcrgH8gEV7fQ+W460JVuyV84pyW0Ixpi0m/L7ND4XaWC94cbx7JBoO0ZqchIcv05FUd2bwt1N26PEgMGyl7jDD50PHfKryOgOe4dIR+HZx4fyK2o5/fkEkfVrxkjAuza4I2zW/Kde3Uyi2gP82KEY8ChuIcC5AbN3OMaTsiHFB8Y7TqZRZIEalNpZur8bg9s3WPihEnteMEjjvAcJwH7bGuSXSRDKML0sWou0mL8W8Pw==";
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        // The standard secure default length for RSA keys is 2048 bits
        modulusLength: 2048,
      });
      const decryptedData = crypto.privateDecrypt(
        {
          key: privateKey,
          // In order to decrypt the data, we need to specify the
          // same hashing function and padding scheme that we used to
          // encrypt the data in the previous step
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        },
        Buffer.from(encryptedData,"utf8")
      );

      res.send("decrypted data: ", decryptedData.toString());
    })

module.exports = router;
