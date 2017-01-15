var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/', function (req, res, next) {
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: bcrypt.hashSync(req.body.password, 10),
		email: req.body.email,
		wcpssId: req.body.wcpssId,
		school: req.body.school
	});
	user.save(function(err, result) {
		if (err) {
			return res.status(500).json({
				title:'An Error Occurred in saving a user',
				error: err
			});
		};
		res.status(201).json({
			message: 'Saved User definition',
			obj: result
		});
	});
});

router.get('/userlist', function( req, res, next) {
	User.find({},function(err,users){
		if (err) {
			return res.status(500).json({
				title:'An Error Occurred in finding all users',
				error: err
			});
		};
		if (!users) {
			return res.status(401).json({
				title:'gasp ! there are no users',
				error: err
			});
		};
		res.status(200).json({
			message: 'here are the users',
			obj: users
		});
	})

});

router.post('/signin', function( req, res, next) {
	User.findOne({email:req.body.email},function(err,user){
		if (err) {
			return res.status(500).json({
				title:'An Error Occurred in finding a user for login',
				error: err
			});
		};
		if (!user) {
			return res.status(401).json({
				title:'No user found',
				error: err
			});
		};
		if (!bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(401).json({
				title:'incorrect password - please try again',
				error: err
			});
		};
		var token = jwt.sign({user: user}, 'secretkey', {expiresIn: 7200});
		res.status(200).json({
			message: 'Thanks for the login',
			token : token,
			userId: user._id 
		});
	})

});

module.exports = router;
