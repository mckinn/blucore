var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var transporter = require('../models/emailmodel');

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

    // setup email data with unicode symbols
    let mailOptions = {
        //from: '"Jumping Jehosophat" <mckinn@yahoo.com>',
        //from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        envelope: {
            from: '"Jumping Jehosophat" <mckinn@yahoo.com>', // used as MAIL FROM: address for SMTP
            to: req.body.to // used as RCPT TO: address for SMTP
        },
        subject: req.body.subject, // Subject line
        text: req.body.body
    };

    console.log("the email options", mailOptions);

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
});

module.exports = router;
