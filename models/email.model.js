// All things required to sent an email.

var nodemailer = require("nodemailer");

var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

var sendBluCoreEmail = function (  to, from, toFriendly, fromFriendly,
                        subject, templateName, bodyText, fillins ){

        var transporter; // in support of close.

        var prepareAndSend_p = function (htmlbody){
            // nodemailer v3 format.
            transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                        type: 'OAuth2',
                        user: 'blucore.emaildaemon@gmail.com',
                        clientId: process.env.GMAIL_CLIENTID,
                        clientSecret: process.env.GMAIL_CLIENTSECRET,
                        refreshToken: process.env.GMAIL_REFRESHTOKEN,
                        accessToken: 'ya29.Gls2BAvYJwvJDDH53ch2yoe67dqsbGX-fjXnQL-3Lg8oyqWRBH42ZQLLBk8BB-nxnD-NEGQvhzgHApDzg26pODGgC0JMlFyIfTCZqeem_AeuBF80cgHn-BdW7bEs',
                        expires: 1484314697597
                    },
                debug:true
            });

            // console.log("the transporter: ", transporter);
            let mailOptions = {
                replyTo: fromFriendly + '<' + from + '>',   // sender
                // gmail sets the 'from'
                to: toFriendly + '<' + to + '>',            // receiver
                subject: subject,                           // Subject line
                generateTextFromHTML: true,                 // text body
                html: htmlbody.html                         // html body
            };

            console.log("Mail Options:", mailOptions);
            return transporter.sendMail(mailOptions);       // as a Promise.
        }; 

        // console.log ("the arguments", "\nto:",to, "\nfrom: ",from, "\nTo Name: ", toFriendly, "\nFrom Name: ", fromFriendly, "\nSubject: ",
        //                               subject, "\nTemplate: ", templateName, "\nBody: ", bodyText, "\nFillins", fillins);
        // find the template
        var templateDir = path.resolve(__dirname, '../templates', templateName);
        // console.log("template: ", templateDir);
        
        // apply the template with the standard identifiers in the body.
        var interpersonal = new EmailTemplate(templateDir);
        var user = {toEmail: to, 
                    fromEmail: from ,  
                    toFriendly: toFriendly, 
                    fromFriendly: fromFriendly,
                    subject: subject,
                    body: bodyText.replace(/\n/g, "<br>")};

        Object.assign(user,fillins);
        // console.log("The aggregate user payload",user, fillins);
        // console.log("email user for rendering ",user);
        return interpersonal.render(user)
            .then(prepareAndSend_p)
            .then(response => {
                // console.log("Email send response: ",response);
                transporter.close();
            })
            .catch(error => {
                console.log("Error sending the email", error );
            });
    }

module.exports = sendBluCoreEmail;