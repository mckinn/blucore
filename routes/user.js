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
		school: req.body.school,
		kind: req.body.kind
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

router.patch('/users/:uid', function( req, res, next) {
	console.log("--------------------------------------------");
	// Make sure that we don't change the [events] as the result of an update.
	console.log(req.params.uid);
	User.findById(req.params.uid,function(err,user){
		if (err) {
			return res.status(500).json({
				title:'An Error Occurred in finding a user as a part of an update',
				error: err
			});
		};
		if (!user) {
			return res.status(404).json({
				title:'gasp ! user cannot be found to perform update',
				error: err
			});
		};
		console.log(req.body);
		console.log(user);

		if( req.body.email ) user.email = req.body.email;
		if( req.body.firstName ) user.firstName = req.body.firstName;
		if( req.body.lastName ) user.lastName = req.body.lastName;
		if( req.body.wcpssId ) user.wcpssId = req.body.wcpssId;
		if( req.body.school ) user.school = req.body.school;
		if( req.body.kind ) user.kind = req.body.kind;
		// don't touch the list of events, or the _id
		// only touch the password if it is not null
		if( req.body.password ) {
			console.log("* * * * password change request * * * * ");
			console.log(req.body.password,bcrypt.hashSync(req.body.password, 10));
			user.password = bcrypt.hashSync(req.body.password, 10);
		};

		console.log(user);
		user.save( function (err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred',
					error: err
				});
			};
			console.log(result);
			res.status(200).json({
				message: 'Updated Event',
				obj: result
			});
		});
	})

});

router.get('/users', function( req, res, next) {
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

router.get('/users/:uid', function( req, res, next) {
	console.log(req.params.uid);
	User.findById(req.params.uid,function(err,user){
		if (err) {
			return res.status(500).json({
				title:'An Error Occurred in finding a user',
				error: err
			});
		};
		if (!user) {
			return res.status(404).json({
				title:'gasp ! user cannot be found',
				error: err
			});
		};
		res.status(200).json({
			message: 'here is the user',
			obj: user
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
