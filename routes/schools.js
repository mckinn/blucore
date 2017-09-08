var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var School = require('../models/school.model');

// no requirement to check for logged in user, because
// we need the list of schools to add a user

router.options('/', function( req, res, next) {  // pre-flight on sign-in
	// console.log("pre-flight on sign-in");
	return res.status(200).json({
		title:'options response'
	});
});

router.get('/', function( req, res, next) {  // get a list of schools
    // console.log("in school");
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
        // console.log("the schools: ",schools);
		res.status(200).json({
			message: 'here are the schools',
			obj: schools
		});
	})

});

module.exports = router;
