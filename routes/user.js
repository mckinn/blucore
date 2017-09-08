var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');
var School = require('../models/school.model');
var BluCoreEmail = require('../models/email.model');
var Secret = require('../models/secret.model');

router.post('/', function (req, res, next) { // create a new user
	var createdUser;
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: bcrypt.hashSync(req.body.password, 10),
		email: req.body.email,
		emailValid: req.body.emailValid,
		school: req.body.school,
		kind: req.body.kind
	});
	user.valid = "unknown";
	user.phone = req.body.phone;

	var secretNeeded;
	console.log("user save: ",user);
	user.save() // save the user
		.then( // create the secret
			function(result){
				console.log("save OK: ",result);
				// creation of the email will not impact the success or failure of 
				// API call, so we just continue on from here.
				console.log("in user.js routes creating a secret: ", user.email, result._id);
				return Promise.resolve(Secret.createSecret(result._id)) ;
			})
		.then( // send the email
			function(result) // result should be the secret value.
					{ 
					console.log("secret creation success!",result, secretNeeded);
					// ToDo - I could send an email to users that join that don't have a link
					// with the note 'wait around to be approved'
					// if (secretNeeded) {
						console.log("getting the school");
						School.findOne({'name':user.school},function(err,school){
							if (!err && school) { // no error and there are schools
								adminEmail = school.adminEmail;
							} else {
								adminEmail = "blucore.manager@gmail.com";
							}
							console.log("in findschool callback: ", adminEmail);
							var urlString = process.env.API_ENDPOINT+"email/validate/"+ result._id +
											"?userId=" + result.userId + "&uniqueString=" +result.uniqueString;
							console.log("admin email",adminEmail);
							BluCoreEmail ( 
								user.email, // "mckinn@gmail.com", // , 
								adminEmail, 
								user.firstName, 
								"The bluCore admin",
								"bluCore Email Validation", 
								"autoVerified", 
								"",
								{ validationLink : urlString });
						});
					// }

			})
		.then(function(result){
			// console.log("returning 201");
			return res.status(201).json({
				title:"success",
				result: result
			});
		})
		.catch(
			function(error) {
				console.log("failure :-(", error);
				// console.log("res ",res);
				return res.status(500).json({
					title:'An Error Occurred in saving a user',
					error: error
				});
			});
});

router.options('/', function( req, res, next) {  // pre-flight on sign-in
	// console.log("pre-flight on sign-in");
	return res.status(200).json({
		title:'options response'
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

router.post('/reset', function( req, res, next) {

	var errorStage = {  desc: "Can't find a user with the email: "+ req.body.email,
						code: 404 
						};

	var operationalUser; 

	var findUserQuery = User.findOne({email:req.body.email});

	findUserQuery.exec()  // execute the query as a promise.
		.then(
			function(user){
			if (!user) {
				throw new Error();
			}
			operationalUser = user;
			console.log("found the user: ",operationalUser);
			return user;
		})
		.then(
			function(user) {
				console.log("in user.js routes creating a secret: ", user.email, user._id);
				return Promise.resolve(Secret.createSecret(user._id)) ;
			})
		.then(
			function(secret) {
				var errorStage = {
					desc: "Fatal error in finding a school: "+ req.body.email,
					code: 500 
					};
				console.log("getting the school", operationalUser);
				School.findOne({'name':operationalUser.school},function(err,school){
					if (!err && school) { // no error and there are schools
						adminEmail = school.adminEmail;
					} else {
						adminEmail = "blucore.manager@gmail.com";

					}
					console.log("in findschool callback: ", adminEmail);
					var urlString = process.env.API_ENDPOINT+"authentication/users/resetpassword/"+ secret._id +
									"?userId=" + secret.userId + "&uniqueString=" +secret.uniqueString;
					console.log("admin email",adminEmail);
					BluCoreEmail ( 
						operationalUser.email, // "mckinn@gmail.com", // , 
						adminEmail, 
						operationalUser.firstName, 
						"The bluCore admin",
						"bluCore User Validation", 
						"passwordReset", 
						"",
						{ validationLink : urlString });
				});
				res.status(200).json({
					message: "Email sent",
					obj: operationalUser
				})
			})
		.catch(
			function(error) {
				console.log("failure :-(", error);
				console.log(errorStage);
				return res.status(errorStage.code).json({
					title: errorStage.desc,
					error: error
				});
			}
		);
	});

router.post('/replacepassword', 
	function(req,res,next){
		// find the user, based on the user-id
		// confirm the secrets
		// update the password.
		operationalUser: User;

		console.log("in replacepassword:", req.body);

		var findUserQuery = User.findOne({_id:req.body.userId});

		findUserQuery.exec()  // execute the query as a promise.
		.then(
			function(user){
			if (!user) {
				console.log("failure to find user: ",user)
				throw new Error("Can't find the user for a password reset");
			}
			operationalUser = user;
			console.log("found the user: ",operationalUser);
			// return user;
			Promise.resolve(operationalUser);
		})
		.then(Secret.checkSecret(req.body.secretId,req.body.uniqueString))
		// user and secret are both valid
		.then(
			function(){
				console.log("The operational user:", operationalUser);
				if( req.body.password ) {
					// console.log("* * * * password change request * * * * ");
					// console.log(req.body.password,bcrypt.hashSync(req.body.password, 10));
					operationalUser.password = bcrypt.hashSync(req.body.password, 10);
					operationalUser.save( function (err, result) {
						if (err) {
							throw new Error("Failed to update the user in replace password");
						};
						// console.log(result);
						return res.status(200).json({
							message: 'Updated Event',
							obj: result
						});
					});
				};

			})
		.catch(function(error) {
				console.log("failure in replace password :-(", error);
				console.log(error);
				return res.status(400).json({
					title: error.message,
					error: error
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
	var adminEmail = "mckinn@gmail.com";
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
		console.log("req body: ",req.body);
		console.log("user: ",user);

		// determine whether to send validation emails
		if (user.valid != req.body.valid)  // something has changed to approved, rejected, unknown
			 { 
				var templateName;
				if (req.body.valid == "approved") {
					// send a OK email
					templateName = 'verified'
				} else {
					// send a failure email and reset the validation pending
					if (req.body.valid == "rejected") {
						templateName = 'notVerified'
					} else { templateName = 'waiting' }
				}
				if (req.body.valid != "unknown") {
					// find the school administrator to fill into the email.
					School.findOne({'name':req.body.school},function(err,school){
						if (!err && school) { // no error and there are schools
							adminEmail = school.adminEmail;
						};
						console.log("admin email",adminEmail, templateName);
						BluCoreEmail ( user.email, adminEmail, user.firstName, "The bluCore admin",
									"bluCore User Validation", templateName, "",{});
					});
				}
			}
		console.log("inside patch ",req.body);

		if( req.body.email ) user.email = req.body.email;
		if( req.body.firstName ) user.firstName = req.body.firstName;
		if( req.body.lastName ) user.lastName = req.body.lastName;
		if( req.body.school ) user.school = req.body.school;
		if( req.body.kind ) user.kind = req.body.kind;
		if( req.body.phone ) user.phone = req.body.phone;
		if( req.body.myEvents ) user.events = req.body.myEvents;
		if( req.body.attendedEvents ) user.attendedEvents = req.body.attendedEvents;
		if( req.body.valid ) user.valid = req.body.valid;
		// we don't touch user.emailValid because the form will never have it.
		
		// don't touch the _id
		// only touch the password if it is not null
		if( req.body.password ) {
			// console.log("* * * * password change request * * * * ");
			// console.log(req.body.password,bcrypt.hashSync(req.body.password, 10));
			user.password = bcrypt.hashSync(req.body.password, 10);
		};

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
