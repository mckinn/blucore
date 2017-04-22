// school.model.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = global.Promise;

var schema = new Schema({
	name: {type: String, required: true, unique: true},
	abbreviation: {type: String, required: true, unique: true},
	adminEmail: {type: String, required: true},
    adminName: {type: String, required: true}
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('School',  // creates a collection in the database called 'schools'
	schema );