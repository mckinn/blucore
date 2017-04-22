var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var appRoutes = require('./routes/app');
var eventRoutes = require('./routes/events');
var userRoutes = require('./routes/user');
var emailRoutes = require('./routes/email');
var schoolRoutes = require('./routes/schools');

var app = express();
// mongoose.connect('localhost:27017/blucore');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://blucoreUser:subbylou@ds153689.mlab.com:53689/blucore');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/event', eventRoutes);
app.use('/user', userRoutes);
app.use('/email', emailRoutes);
app.use('/schools', schoolRoutes);
app.use('/', appRoutes);

// catch 404 and forward to error handler

app.use(function (req, res, next) {
    return res.render('index');
});

module.exports = app;
