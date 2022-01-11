
var expHBS  = require('express-handlebars');
var express = require('express');
var app = express();

expHBS.registerHelper('loud', function (aString) {
  return aString.toUpperCase()
})