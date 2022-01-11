var express = require('express');
var router = express.Router();
const mongoose = require ('mongoose');
const createPost = require ("../schema/create-post");

/* GET home page. */
router.get('/', function(req, res, next) {

  const allpost= createPost.find().lean()
    .then((result)=>   res.render('index', { title: 'Orgus Newspaper',data:result }))
    .catch((err)=> console.log(err))
});

router
.get('/demo',(req,res)=> {
  res.render('demo',{firstname: 'Abiku', lastname: "dabike"})
})

module.exports = router;
