// All things required to sent an email.
'use strict';
const nodemailer = require('nodemailer');

// var helper = require('sendgrid').mail;
// var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

var sendBluCoreEmail = function (  to, from, toFriendly, fromFriendly,
                        subject, templateName, bodyText, fillins ){

        var prepareAndSend_p = function (htmlbody){

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'blucore.emaildaemon@gmail.com',
                    pass: 'athens drive high school'
                }
            });

            console.log("the transporter: ", transporter);
            console.log("options.auth.user: ", transporter.options.auth.user );
            // console.log("Mail.options.auth.user: ", transporter.Mail.options.auth.user );

            // setup email data with unicode symbols
            let mailOptions = {
                replyTo: fromFriendly + '<' + from + '>',     // sender
                from: 'the bluCore email bot <' + transporter.options.auth.user  + '>',          // gmail does this anyway
                to: toFriendly + '<' + to + '>',           // receiver
                // to: to,
                subject: subject,                           // Subject line
                // text: 'Hello world ?',                      // plain text body
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
            })
            .catch(error => {
                //error is an instance of SendGridError
                //The full response is attached to error.response
                console.log("Error sending the email", error );
            });
    }

module.exports = sendBluCoreEmail;