// this is used to persist a value used in email validation.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
	userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    uniqueString: {type: String, required: true, unique: true}
});

mongoose.Promise = global.Promise;
schema.plugin(mongooseUniqueValidator);

 // creates a collection in the database called 'secrets' I think

var Secret = mongoose.model('Secret', schema );

module.exports = Secret;

module.exports.createSecret = function(userId) {
    // create a secret based on the userId,  and a random number.
    var randomString = function (len)
        {
            var outStr = "", newStr;
            while (outStr.length < len)
            {
                newStr = Math.random().toString(36).slice(2);
                outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
            }
            return outStr.toUpperCase();
        };
    console.log(" userId in createSecret: ", userId);
    var secret = new Secret({
        userId: userId,
        uniqueString: randomString(100)});
    
    console.log("the created secret: ", secret);

    return new Promise(function(resolve, reject){
        secret.save(function(err, result)
            {
                console.log("in save secret ", err, result);
                if (err) {
                    console.log("error in save secret",err);
                    reject(Error({
                        title:'An Error Occurred in saving a secret',
                        error: err
                    }));
                } else {
                    console.log("the result",result);
                    resolve(result);
                }
            });
        });
 
    };

module.exports.checkSecret = function(secretId, obscure) {
    var promisedSecret = new Promise(function(resolve, reject) {
        if (secretId) {
            Secret.findById(secretId, function(err,secret){
                if (err) {
                    reject({
                        title:'An Error Occurred in finding a user as a part of an update',
                        error: err
                    });
                };
                if (!secret) {
                    reject({
                        title:'gasp ! user cannot be found to perform update',
                        error: err
                    });
                };
                if (obscure == secret.uniqueString) { // the strings match and the id was correct
                    resolve(secret);
                } else {
                    reject({
                        title:'there is no secret parameter'
                    });
                }
            });
        } else {
            reject({
                title:'there is no secret parameter'
            });
        }});
	return promisedSecret;
    }

