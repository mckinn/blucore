var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// var Promises = require('bluebird');
var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

var transporter = require('../models/emailmodel');
var htmlemail = require('../models/emailhtml');

// check for logged in user
router.use('/',function(req,res,next){
	jwt.verify(req.query.token, 'secretkey', function (err, decoded) {
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

    emailAddress = req.body.from;
    friendly = req.body.fromCommon;
    bodyText = req.body.body;

    var prepareAndSend_p = function (htmlbody){
        console.log("htmlbody",htmlbody );
        let mailOptions = {
            from: '"'+req.body.fromCommon+'"<blucore.emaildaemon@gmail.com>',
            to: '"'+req.body.toCommon+'"<'+req.body.to+'>',
            subject: req.body.subject, // Subject line
            text: req.body.body + '\n\n' + 'The sender can be reached at: '+ req.body.from +'.',
            html: htmlbody.html
        };
        console.log("the email options", mailOptions);

        // send mail with defined transport object
        return new Promise(function(resolve,reject){
            transporter.sendMail(mailOptions, function(error, info) {
                console.log("inside the callback for sendmail: ", error, info);
                if (error) {
                    console.log(error);
                    reject(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                resolve({message:'email sent'});
            });
            }
        )
    };

    console.log ("the arguments",emailAddress, friendly, bodyText);

    var templateDir = path.resolve(__dirname, '../templates', 'interpersonal');
    console.log("template: ", templateDir);
    
    var interpersonal = new EmailTemplate(templateDir);
    var user = {name: friendly, email: emailAddress, body: bodyText.replace(/\n/g, "<br>")};

    // var interpersonal_p = interpersonal.render(user);
    // interpersonal_p
    interpersonal.render(user)
        .then(prepareAndSend_p)
        .then(function(outcome){
            res.status(200).json(outcome);
        });

    console.log("end of the chain");

});

module.exports = router;
