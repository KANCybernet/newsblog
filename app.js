var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expHBS = require('express-handlebars');
var helper = require('./helpers/helpers.js');
var mongoose = require('mongoose');
var bcypt = require('bcrypt');
var app = express();


mongoose.pluralize(null);

const port = 5000;
const mongodbUrl = "mongodb+srv://blog:blog12345@blog.jknee.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect('mongodb://localhost/blog' || mongodbUrl, { useUnifiedTopology: true, useNewUrlParser: true })
    .then((result) =>
        app.listen(port, () => console.log("Server started on port:" + port)))
    .catch((err) => console.log("failed to connect"));


    const session = require('express-session');
    app.use(session({
      secret: "qEas5ns3gxl41G",
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
      saveUninitialized: false
    }));
    const passport = require('passport')
    const pass_config = require('./passport-login')
    
    

    app.use(passport.authenticate('session'));
    app.use(passport.initialize())
    app.use(passport.session());



var homeRouter = require('./routes/home');
var adminRouter = require('./routes/admin');


var hbs = expHBS.create({
    extname: 'hbs',
    defaultLayout: false,
    layoutsDir: path.join(__dirname, 'views/layout'),
    helpers: helper
})
app.use(express.static(path.join(__dirname, 'public')));
// view engine setup


app.engine('hbs', hbs.engine)
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
app.get('*', function(req, res) {
    res.status(404).render("failed", { message: "Not Found" });
});


module.exports = app;