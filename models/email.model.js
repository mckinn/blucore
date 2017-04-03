// All things required to sent an email.
'use strict';
const nodemailer = require('nodemailer');

// var helper = require('sendgrid').mail;
// var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

var sendBluCoreEmail = function (  to, from, toFriendly, fromFriendly,
                        subject, templateName, bodyText ){

        // take the html body of the email, and prepare it and send it
        /*
        var prepareAndSend_p = function (htmlbody){
            console.log("htmlbody",htmlbody.html );
            var from_email = null; // new helper.Email(from); // fromFriendly
            var to_email = new helper.Email(to); //toFriendly
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
        }; */
        
        var prepareAndSend_p = function (htmlbody){

            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'blucore.emaildaemon@gmail.com',
                    pass: 'athens drive high school'
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: fromFriendly + '<' + from + '>',     // sender
                // from: from,
                to: toFriendly + '<' + to + '>',           // receiver
                // to: to,
                subject: subject,                           // Subject line
                text: 'Hello world ?',                      // plain text body
                html: htmlbody.html                         // html body
            };

            console.log("Mail Options:", mailOptions);

            // send mail with defined transport object
            // if no callback is specified then a promise is returned.
            return transporter.sendMail(mailOptions);
        }; 


        console.log ("the arguments", "\nto:",to, "\nfrom: ",from, "\nTo Name: ", toFriendly, "\nFrom Name: ", fromFriendly, "\nSubject: ",
                                      subject, "\nTemplate: ", templateName, "\nBody: ", bodyText);

        // find the template
        var templateDir = path.resolve(__dirname, '../templates', templateName);
        console.log("template: ", templateDir);
        
        // apply the template with the identifiers 'name' and 'email' in the body
        var interpersonal = new EmailTemplate(templateDir);
        var user = {name: fromFriendly, 
                    email: from, 
                    body: bodyText.replace(/\n/g, "<br>")};

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