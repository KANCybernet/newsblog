var express = require('express');
var router = express.Router();
const adminProfile = require("./schema/admin-account");
var app = express();
var mongoose = require('mongoose');


mongoose.pluralize(null);

const port = 5100;
mongoose.connect('mongodb://localhost/blog', { useUnifiedTopology: true, useNewUrlParser: true })
    .then((result) =>
        app.listen(port, () => console.log("Server started on port:" + port)))
    .catch((err) => console.log("failed to connect"));



    adminProfile.find().lean()
    .then((result)=>{
       console.log(result)
    })
    .catch((err)=>{
        console.log('Not Found'+err)
    })
  