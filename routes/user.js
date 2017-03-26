var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/', function (req, res, next) { // create a new user
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: bcrypt.hashSync(req.body.password, 10),
		email: req.body.email,
		wcpssId: req.body.wcpssId,
		school: req.body.school,
		kind: req.body.kind
	});
	user.valid = false;
	user.validationPending = true;
	// Todo
	// when we are adding a user, make sure that we
	// email them to tell them that they are being verifed,
	// and to welcome them.
	//
	// also email the coordinator to tell that coordinator to validate them
    //
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

router.post('/signin', function( req, res, next) {  // sign in 
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
		//Creates a token that contains the encrypted user email for subsequent authorization
		res.status(200).json({
			message: 'Thanks for the login',
			token : token,
			userId: user._id 
		});
	})

});


// check for logged in user
router.use('/',function(req,res,next){
	// console.log("checking in user.js: ",req.query.token," or ", req.headers['x-token'] );
    var token = req.body.token || req.query.token || req.headers['x-token'];
	jwt.verify(token, 'secretkey', function (err, decoded) {
		if (err) {
			return res.status(401).json({
				title:'user no longer logged in',
				error: err
			});
		};
		next();
	})
});

router.get('/users/:uid', function( req, res, next) {   // get the details for a user
	// console.log(req.params.uid);
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



router.patch('/users/:uid', function( req, res, next) {  // update a user - must be logged in to do this.
	// console.log("--------------------------------------------");
	// Make sure that we don't change the [events] as the result of an update.
	// console.log(req.params.uid);
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
		// console.log("---------------------- Updating user -------------------")
		// console.log(req.body);
		// console.log(user);

		if( req.body.email ) user.email = req.body.email;
		if( req.body.firstName ) user.firstName = req.body.firstName;
		if( req.body.lastName ) user.lastName = req.body.lastName;
		if( req.body.wcpssId ) user.wcpssId = req.body.wcpssId;
		if( req.body.school ) user.school = req.body.school;
		if( req.body.kind ) user.kind = req.body.kind;
		if( req.body.myEvents ) user.events = req.body.myEvents;
	 	user.valid = req.body.valid;
		
		// don't touch the _id
		// only touch the password if it is not null
		if( req.body.password ) {
			// console.log("* * * * password change request * * * * ");
			// console.log(req.body.password,bcrypt.hashSync(req.body.password, 10));
			user.password = bcrypt.hashSync(req.body.password, 10);
		};

		if (user.validationPending && user.valid) { // the state has changed to valid from invalid
			// reset the pending status and send an email.
			user.validationPending = true;
			// Send the right form of email
			// Todo
		}

        // Todo
		// If a user has their verified bit moved from no to yes, we should tell them
		// in an email from their coordinator, and give them a propper welcome.
		//
		// console.log(user);
		user.save( function (err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred',
					error: err
				});
			};
			// console.log(result);
			res.status(200).json({
				message: 'Updated Event',
				obj: result
			});
		});
	})

});

router.get('/users', function( req, res, next) {  // get a list of users
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

router.get('/users/:uid', function( req, res, next) {   // get the details for a user
	// console.log(req.params.uid);
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



module.exports = router;
