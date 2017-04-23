var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var BluCoreEmail = require('../models/email.model');
var Secret = require('../models/secret.model');
var User = require("../models/user");

// var helper = require('sendgrid').mail;
// var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// var Promises = require('bluebird');
// var EmailTemplate = require('email-templates-v2').EmailTemplate;
// var path = require('path');

// var transporter = require('../models/emailmodel');
// var htmlemail = require('../models/emailhtml');


router.get('/validate/:secretId', 
    function (req,res,next){
        // console.log("req.query",req.query);
        // console.log("uniqueString",req.query.uniqueString);
        // console.log("userId",req.query.userId);
        var URLValues = {
            uniqueString : req.query.uniqueString,
            userId : req.query.userId,
            secretId : req.params.secretId
        }
        // console.log("URLvalues",URLValues);
        // look up the secret, and if we find it, validate the user
        // and return a success payload.  If we can't find it
        // return a failed payload.
        var foundSecret;
        var foundUser;
        
        Secret.findById(URLValues.secretId)
            .then((result) => {
                // console.log("trying result 1:",result);
                foundSecret = result;
                // console.log("trying result 1:",foundSecret);
//              Promise.resolve(User.findById( URLValues.userId))
                var query = User.findById( URLValues.userId );
                return query.exec();    // should this return a promise, and will that work ?
            })
            .then((result) => {
                // console.log("trying result 2:",result);
                foundUser = result;
                // console.log("trying result 2:",foundUser);
                return Promise.resolve(foundUser);
            })
            .then((result)=> {
                // console.log("checking validity: ",result);
                // console.log("1",String(foundUser._id));
                // console.log("2",String(foundSecret.userId));
                // console.log("3",String(foundSecret.uniqueString));
                // console.log("4",String(URLValues.uniqueString));

                if ((( String(foundUser._id) == String(foundSecret.userId)) &&
                    ( String(foundSecret.uniqueString) == String(URLValues.uniqueString))) ||
                    ( String(foundUser.valid) == "approved")
                    ){
                        // it all matches
                        // patch the user with validation

                        // dump an html file saying congratulations
                        // console.log("hurray", foundUser);
                        foundUser.valid="approved";
                        foundUser.save();
                        res.render("verified",
                                    {toFriendly: foundUser.firstName,
                                    signinURL: process.env.API_ENDPOINT + 'authentication/signin'});
                    } else {
                        // it does not match
                        // report validation failed
                        // potentially mark failed.
                        // console.log("boo");
                        foundUser.valid="rejected";
                        foundUser.save();
                        res.render("notVerified",{toFriendly:foundUser.firstName});
                    }

            })
            .catch((error)=> {
                // console.log("caught error: ", error);
                return res.status(400).json({ title:"error in validation #2 ",error});

            })

        

/*        return res.status(200).json(
            { title:"got the secret",
              secretId: URLValues.secretId ,
              uniqueString: URLValues.uniqueString,
              userId: URLValues.userId});*/
    });

router.post('/validate',
    function( req, res, next){
        // console.log("inside POST validate: ", req.body);
        secret = Secret.createSecret(req.body.userId);
        // console.log("the secret:",secret);  // returns a promise
        secret.then(function(result){console.log("success!",result);
                                     return res.status(201).json(result); },
                    function(error) {console.error("failure :-(", error);
                                     return res.status(400).json(result);}
            );
    });

// check for logged in user
router.use('/',function(req,res,next){
    // console.log("checking in email.js: ",req.query.token," or ", req.headers['x-token'] );
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

router.post('/', function (req, res, next) {

    // console.log("inside post ",req.body);
    BluCoreEmail ( req.body.to, req.body.from, req.body.toCommon, req.body.fromCommon,
                                    req.body.subject, req.body.templateName, req.body.body,{})
        .then(function(resolve,reject){
            // console.log("resolved: ", resolve());
            // console.log("reject: ", reject());
            res.status(200).json(resolve);
        });
    });

module.exports = router;
