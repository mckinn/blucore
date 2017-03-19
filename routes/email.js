var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

// var Promises = require('bluebird');
var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

var transporter = require('../models/emailmodel');
var htmlemail = require('../models/emailhtml');

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

    var emailAddress = req.body.from;
    var friendly = req.body.fromCommon;
    var bodyText = req.body.body;
    var templateName = req.body.templateName;

    // console.log("the API key: ",process.env.SENDGRID_API_KEY);

    // take the html body of the email, and prepare it and send it
    var prepareAndSend_p = function (htmlbody){
        console.log("htmlbody",htmlbody.html );

        var from_email = new helper.Email(req.body.from);
        var to_email = new helper.Email(req.body.to);
        var subject = req.body.subject;
        var content = new helper.Content('text/html', htmlbody.html);
        var mail = new helper.Mail(from_email, subject, to_email, content);

        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        console.log("the email: ", request.body);

        // send mail with defined transport object
        return sg.API(request);
    };

    console.log ("the arguments",emailAddress, friendly, bodyText, templateName);

    var templateDir = path.resolve(__dirname, '../templates', templateName);
    console.log("template: ", templateDir);
    
    var interpersonal = new EmailTemplate(templateDir);
    var user = {name: friendly, email: emailAddress, body: bodyText.replace(/\n/g, "<br>")};

    // var interpersonal_p = interpersonal.render(user);
    // interpersonal_p
    interpersonal.render(user)
        .then(prepareAndSend_p)
        .then(response => {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        .catch(error => {
            //error is an instance of SendGridError
            //The full response is attached to error.response
            console.log("this is the error", error.response, error.response.statusCode);
        });
/*        .then(function(resolve,reject){
            console.log("resolved: ", resolve());
            console.log("reject: ", reject());
            res.status(200).json(resolve);
        });*/

    console.log("end of the chain");

});

/*router.post('/', function (req, res, next) {

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

});*/

module.exports = router;
