var express = require('express');
var app = express();
var mongoose = require('mongoose');


mongoose.pluralize(null);
const port = 5000;

const mongodbUrl = "mongodb+srv://blog:blog12345@blog.jknee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect('mongodb://localhost/blog' || mongodbUrl, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((result) =>
        app.listen(port, () => console.log("Server started on port:" + port)))
    .catch((err) => console.log("failed to connect"));
