var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expHBS  = require('express-handlebars');


var hbs  = expHBS.create({
  extname: 'hbs',
  defaultLayout: false,
  layoutsDir: path.join(__dirname,'views/layout'),
  helpers: {
    upperCase: function (aString) {
  return aString.charAt(0).toUpperCase() + aString.slice(1);
    },
    incrementByOne:(data)=> {
      return data + 1;
    },
    list: (data,options)=>{
      var obj=[];
      for(var i= 0; i < data.length; i++)
      {
        if(i < 4)
        {
          console.log(i)
          obj.push(options.fn(data[i]));
        } 
      }
      return obj
    }
   
  }
})
var mongoose = require('mongoose');
var bcypt = require('bcrypt');
mongoose.pluralize(null);

const port= 3000;
mongoose.connect('mongodb://localhost/blog',{ useUnifiedTopology: true, useNewUrlParser:true })
    .then((result) => 
    app.listen(port,()=> console.log("Server started on port:" + port)))
    .catch((err)=> console.log("failed to connect"));

var homeRouter = require('./routes/home');
var adminRouter = require('./routes/admin');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
// view engine setup


app.engine('hbs',hbs.engine)
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', homeRouter);
app.use('/admin', adminRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); 
app.get('*', function(req, res){
  res.status(404).render("failed",{message:"Not Found"});
});


module.exports = app;