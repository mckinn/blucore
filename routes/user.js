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
		wcpssId: req.body.wcpssId,
		school: req.body.school,
		kind: req.body.kind
	});
	user.valid = "unknown";
	// Todo later.  
	// when we are adding a user, make sure that we
	// email them to tell them that they are being verifed,
	// and to welcome them.
	//
	// also email the coordinator to tell that coordinator to validate them
    //
	// For now we will assume that the important emails are the 
	// 'approved' and 'rejected' to the user when the record is updated (patched).



	/*	user.save(function(err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred in saving a user',
					error: err
				});
			};
			createdUser = result;
			****************************************BUG HERE***********************  Need to nest callbacks or use promises.
			res.status(201).json({
				message: 'Saved User definition',
				obj: result
			});
		});*/
	
/*	var promise = new Promise(function(resolve, reject) {
		// do a thing, possibly async, then…

		if ( everything turned out fine ) {
			resolve("Stuff worked!");
		}
		else {
			reject(Error("It broke"));
		}
	});
	then returns a promise
	save is a promise.
	createSecret is a promise	
*/
	var secretNeeded;
	// console.log("user save: ",user);
	user.save()
		.then( 
			function(result){
				// console.log("save OK: ",result);
				// creation of the email will not impact the success or failure of 
				// API call, so we just continue on from here.
				var emailRE = new RegExp('[a-z,A-Z,0-9,\+\.\-\_]+@.*wcpss\.net');
				if (emailRE.test(result.email)) { // we have a wcpss email address
					// this will send an email address with a special link, and 
					// once they return the link they will be automatically validated.
					secretNeeded = true;
					// console.log("in user.js routes creating a secret: ", result._id);
					return Promise.resolve(Secret.createSecret(result._id)) ;
				} else {
					// console.log("did not try to create secret, but that is OK",user.email);
					// console.log("can go home now ?");
					secretNeeded = false;
					return Promise.resolve("no secret needed");
				}
			})
		.then(
			function(result) // result should be the secret value.
					{ 
					// console.log("secret creation success!",result, secretNeeded);

					if (secretNeeded) {
						// console.log("getting the school");
						School.findOne({'name':user.school},function(err,school){
							if (!err && school) { // no error and there are schools
								adminEmail = school.adminEmail;
							} else {
								adminEmail = "mckinn@yahoo.com";
							}
							// console.log("in findschool callback: ", adminEmail);
							var urlString = "http://localhost:3000/email/validate/"+ result._id +
											"?userId=" + result.userId + "&uniqueId=" +result.uniqueString;
							// console.log("admin email",adminEmail);
							BluCoreEmail ( 
								user.email, // "mckinn@gmail.com", // , 
								adminEmail, 
								user.firstName, 
								"The bluCore admin",
								"bluCore User Validation", 
								"autoVerified", 
								"",
								{ validationLink : urlString });
						});
					}

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
				// console.log("failure :-(", error);
				// console.log("res ",res);
				return res.status(500).json({
					title:'An Error Occurred in saving a user',
					error: error
				});
			});
		});

router.options('/signin', function( req, res, next) {  // pre-flight on sign-in
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
					if (req.body.valid == "rejected") templateName = 'notVerified';
				}
				if (req.body.valid != "unknown") {
					// find the school administrator to fill into the email.
					School.findOne({'name':req.body.school},function(err,school){
						if (!err && school) { // no error and there are schools
							adminEmail = school.adminEmail;
						};
						// console.log("admin email",adminEmail);
						BluCoreEmail ( user.email, adminEmail, user.firstName, "The bluCore admin",
									"bluCore User Validation", templateName, "",{});
					});
				}
			}
		console.log("inside patch ",req.body);

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
