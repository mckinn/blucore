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
	valid: {type: String, default: "unknown"},
	phone: {type: String, required: false, unique: true},
	events: [ {type: Schema.Types.ObjectId, ref: 'Event'} ],
	attendedEvents: [ {type: Schema.Types.ObjectId, ref: 'Event'} ] // ObjectID is an internal GUID	
});

mongoose.Promise = global.Promise;
schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User',  // creates a collection in the database called 'users'
	schema );

module.exports.ensureEventIdInCorrectList = function(user, eventId, attended) {
	// console.log("in EEICL ", user, eventId, attended);
	// if attended then delete the eventId from user.events and add it to user.attendedEvents
	// otherwise do it the other way.
	// simple, huh ?
	// ignore failures, because it doesn't matter.
	// don't allow duplicates

	var checkit = function(userEventId) {
		// true if not equal.
		// console.log("in checkit ",eventId ,userEventId, String(eventId) != String(userEventId));
/*		console.log("typeof eventId ", typeof eventId);
		console.log("typeof userEventId ", typeof userEventId);
		console.log("valueof eventId ", typeof eventId.valueOf());
		console.log("valueof userEventId ", typeof userEventId.valueOf());*/
		return (String(eventId) != String(userEventId));
	}

	// console.log("before filter - user: ", user.events, user.events.filter(checkit));
	user.events = user.events.filter(checkit);
	user.attendedEvents = user.attendedEvents.filter(checkit);
	// console.log("after filter - user: ", user);
	if (attended) {
		user.attendedEvents.push(eventId);
	} else {
		user.events.push(eventId);
	}
	// console.log("comming out of EEICL ", user, eventId, attended);
}