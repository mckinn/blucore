var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var School = require('../models/school.model');

// check for logged in user
router.use('/',function(req,res,next){
	console.log("checking in schools.js: ",req.query.token," or ", req.headers['x-token'] );
	console.log(req);
    var token = req.body.token || req.query.token || req.headers['x-token'];
	jwt.verify(token, 'secretkey', function (err, decoded) {
		if (err) {
			return res.status(401).json({
				title:'user no longer logged in',
				error: err
			});
		};
		console.log("nexting");
		next();
	});
});

router.get('/', function( req, res, next) {  // get a list of schools
    console.log("in school");
	School.find({},function(err,schools){
		if (err) {
			return res.status(500).json({
				title:'An Error Occurred in finding all schools',
				error: err
			});
		};
		if (!schools) {
			return res.status(401).json({
				title:'gasp ! there are no schools - where can we learn?',
				error: err
			});
		};
        console.log("the schools: ",schools);
		res.status(200).json({
			message: 'here are the schools',
			obj: schools
		});
	})

});

module.exports = router;
