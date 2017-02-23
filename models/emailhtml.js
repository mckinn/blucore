
var Promises = require('bluebird');
var EmailTemplate = require('email-templates-v2').EmailTemplate;
var path = require('path');

exports.populateInterpersonalEmail = function (emailAddress, friendly, bodyText) {

    console.log ("the arguments",emailAddress, friendly, bodyText);
/*    let emailToEmbed = '<a href="mailto:' + emailAddress + '" target="_top" class="">' + friendly + ' at ' + emailAddress + '</a>';
    console.log( "email link:",emailToEmbed);*/

    // -----------------------------------------------------------------------

    // var EmailTemplate = require('email-templates-v2').EmailTemplate;
    // var path = require('path');
    
    var templateDir = path.resolve(__dirname, '../templates', 'interpersonal');
    console.log("template: ", templateDir);
    
    var interpersonal = new EmailTemplate(templateDir);
    var user = {name: friendly, email: emailAddress, body: bodyText};

    var promise = interpersonal.render(user);
    return promise.then(
        console.log("the results: ",results.html),
        console.log("the err: ", err)
        );

    /*var async = require('async')
    var users = [
    {name: 'John', pasta: 'Rigatoni'},
    {name: 'Luca', pasta: 'Tortellini'}
    ]
    
    async.each(users, function (user, next) {
    interpersonal.render(user, function (err, results) {
        if (err) return next(err)
        // result.html 
        // result.text 
        // result.subject 
    })
    }, function (err) {
    // 
    })*/
}