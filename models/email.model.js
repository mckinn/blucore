// All things required to sent an email.

var nodemailer = require("nodemailer");

// var helper = require('sendgrid').mail;
// var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var xoauth2 = require('xoauth2');

// listen for token updates (if refreshToken is set)
// you probably want to store these to a db
// generator.on('token', function(token){
//     console.log('New token for %s: %s', token.user, token.accessToken);
// });


var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

var sendBluCoreEmail = function (  to, from, toFriendly, fromFriendly,
                        subject, templateName, bodyText, fillins ){

        var transporter;

        var prepareAndSend_p = function (htmlbody){

            // create reusable transporter object using the default SMTP transport
/*            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'blucore.emaildaemon@gmail.com',
                    pass: 'athens drive high school'
                }
            });*/
/*            var transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    XOAuth2: {
                    user: "blucore.emaildaemon@gmail.com",
                    clientId: "820241991444-k5784bd7c03bbkfg8mvjlmjlkqif77n6.apps.googleusercontent.com",
                    clientSecret: "b8cEv9VmQROROSpK3zTZSLnE",
                    refreshToken: "1/hPe-FTrTI9M3dBdZmYNTbFCgVI5XMKFYt3_nisX5zfY",
                    accessToken: "ya29.Gls1BHztF4gFxtZnu6Sg2OCgu3grl3iHODeX_n7Nuk4bgO1_s3Pu4MYG0U7_0adpt-PausQkV0592wAtQQkiVsdt5O8kiZSa9CLgFTBzfUVszQXhE3mt9oR17Dmq"
                    }
                }
            });*/
            // listen for token updates (if refreshToken is set)
            // you probably want to store these to a db
            // generator.on('token', function(token){
            //     console.log('New token for %s: %s', token.user, token.accessToken);
            // });

            var oauthstuff = xoauth2.createXOAuth2Generator({
                        // type: 'OAuth2',
                        user: 'blucore.emaildaemon@gmail.com',
                        clientId: process.env.GMAIL_CLIENTID,
                        clientSecret: process.env.GMAIL_CLIENTSECRET,
                        refreshToken: process.env.GMAIL_REFRESHTOKEN //,
                        // accessToken: 'ya29.Gls2BAvYJwvJDDH53ch2yoe67dqsbGX-fjXnQL-3Lg8oyqWRBH42ZQLLBk8BB-nxnD-NEGQvhzgHApDzg26pODGgC0JMlFyIfTCZqeem_AeuBF80cgHn-BdW7bEs'
                    });

            oauthstuff.on('token', function (token) {
                console.log('New token for %s: %s', token.user, token.accessToken);
            });

            console.log("oauthstuff ", oauthstuff);

            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    xoauth2: oauthstuff
                },
                debug:true
            });

            transporter.on('log', console.log);

            /*oauthstuff.getToken(function(err, token){
                if(err){
                    return console.log("AUTH XOAUTH2 error in gettoken",err);
                }
                console.log("AUTH XOAUTH2 " + token);
            });*/

            console.log("the transporter: ", transporter);
            console.log("options.auth: ", transporter.options.auth );
            // console.log("Mail.options.auth.user: ", transporter.Mail.options.auth.user );

            // setup email data with unicode symbols
            let mailOptions = {
                replyTo: fromFriendly + '<' + from + '>',     // sender
                // from: 'the bluCore email bot <' + transporter.options.auth.user  + '>',          // gmail does this anyway
                to: toFriendly + '<' + to + '>',           // receiver
                // to: to,
                subject: subject,                           // Subject line
                // text: 'Hello world ?',                      // plain text body
                generateTextFromHTML: true,
                html: htmlbody.html                         // html body
            };

            console.log("Mail Options:", mailOptions);

            // send mail with defined transport object
            // if no callback is specified then a promise is returned.
            return transporter.sendMail(mailOptions);
        }; 


        console.log ("the arguments", "\nto:",to, "\nfrom: ",from, "\nTo Name: ", toFriendly, "\nFrom Name: ", fromFriendly, "\nSubject: ",
                                      subject, "\nTemplate: ", templateName, "\nBody: ", bodyText, "\nFillins", fillins);

        // find the template
        var templateDir = path.resolve(__dirname, '../templates', templateName);
        console.log("template: ", templateDir);
        
        // apply the template with the identifiers 'name' and 'email' in the body
        var interpersonal = new EmailTemplate(templateDir);
        var user = {toEmail: to, 
                    fromEmail: from ,  
                    toFriendly: toFriendly, 
                    fromFriendly: fromFriendly,
                    subject: subject,
                    body: bodyText.replace(/\n/g, "<br>")};

        Object.assign(user,fillins);
        console.log("The aggregate user payload",user, fillins);
        console.log("email user for rendering ",user);
        return interpersonal.render(user)
            .then(prepareAndSend_p)
            .then(response => {
                console.log("Response in then: ",response);
                transporter.close();
            })
            .catch(error => {
                //error is an instance of SendGridError
                //The full response is attached to error.response
                console.log("Error sending the email", error );
            });
    }

module.exports = sendBluCoreEmail;