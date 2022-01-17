var express = require('express');
var router = express.Router();
const mongoose = require ('mongoose');
const createPost = require ("../schema/create-post");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const{ page = 1, limit = 3} = req.query

  // var count
  // async function pageCount() {
  //   let myPromise = new Promise(function(resolve, reject) {
  //     resolve(createPost.find().count());
  //   });
  //   return await myPromise;
     
  // }
  // async function totalDoc () {return  createPost.find().count();}
  // console.log(totalDoc())
  try
  {
    const pageCount = await createPost.find().count();
    const allpost= await createPost.find().lean().limit(limit * 1).skip((page - 1)* limit);
    res.render('index', { title: 'Orgus Newspaper',data:allpost, 
    count : pageCount})
  }
  catch(error){
    //console.log(error)
  }
});

router
.get('/demo',(req,res)=> {
  res.render('demo',{firstname: 'Abiku', lastname: "dabike"})
})

module.exports = router;
