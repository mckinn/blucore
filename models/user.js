// user.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	wcpssId: {type: String, required: false, unique: true},
	school: {type: String, required: true},  // wcpss student or teacher ID
	kind: {type: String}, // A, S, T, P, null
	valid: {type: Boolean, default: false},
	pendingValidation: {type: Boolean, default: true},
	events: [ {type: Schema.Types.ObjectId, ref: 'Event'} ] // ObjectID is an internal GUID	
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User',  // creates a collection in the database called 'users'
	schema );