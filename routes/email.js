var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

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

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"'+req.body.fromCommon+'"<blucore.emaildaemon@gmail.com>',
        //from: req.body.from, // sender address
        // to: req.body.to, // list of receivers
        to: '"'+req.body.toCommon+'"<'+req.body.to+'>',
        /*envelope: {
            from: '"BluCore Emailer" <blucore.emaildaemon@gmail.com>', // used as MAIL FROM: address for SMTP
            to: req.body.to // used as RCPT TO: address for SMTP
        },*/
        subject: req.body.subject, // Subject line
        text: req.body.body + '\n\n' + 'The sender can be reached at: '+ req.body.from +'.',
        html: htmlemail.populateInterpersonalEmail(req.body.from, req.body.fromCommon, req.body.body)
    };

    console.log("the email options", mailOptions);

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
    res.status(200).json({
				message: 'email sent'
			});
});

module.exports = router;
