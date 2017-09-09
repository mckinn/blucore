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

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://blucoreUser:subbylou@ds153689.mlab.com:53689/blucore');

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    console.log("in requireHTTPS",process.env.NODE_ENV,req.secure,req.get('x-forwarded-proto') );
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        console.log("doing requireHTTPS");
        return res.redirect('https://' + req.get('host') + req.url);
    }
    console.log("beyond requireHTTPS");
    next();
  }

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
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-token');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

app.use(requireHTTPS);

// // insist on https
// app.use(function(req, res, next) {
//     // x-forwarded-pronto is apparently a heroku artifact - we will see
//     var schema = req.headers['x-forwarded-proto'];
  
//     if (schema === 'https') {
//       // Already https; don't do anything special.
//       next();
//     }
//     else {
//       // Redirect to https.
//       res.redirect('https://' + req.headers.host + req.url);
//     }
//   });

// handle pre-flight requests
app.options('/*', function( req, res, next) { 
	return res.status(200).json({
		title:'options pre-flight response'
	});
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
