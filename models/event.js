// event.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	date: {type: String, required: true},
	eventNumber: {type: Number, required: true
		//, unique: true
		},  // unique user visible number.  We will use '0' for now.
			// ToDo - fix this
	time: {type: String, required: false},
	duration: {type: String, required: false},
	school: {type: String, required: false},
	roomNumber: {type: String, required: false},
	participantCount: {type: Number, required: false},
	ownerName: {type: String, required: false},
	ownerId: {type: Schema.Types.ObjectId, ref: 'User'},
	participants: [ {type: Schema.Types.ObjectId, ref: 'User'} ]
});

// the eventNumber seed needs to be maintained on the server-side so that it can be allocated.
// it really appears like we have another simple data type in the database that has only
// one value.

// ToDo - this will never happen because we just cancel and don't
//        really remove the event.  This code should never get executed.
// we will have to cover the case where an event is deleted out of a user's list,
// which is the same behavior, but executed in a different place.

schema.post('remove', function (event){
	// console.log("* * * * remove in model * * * *");
	// console.log(event);
	User.findById(event.ownerId, function( err, user) {
		user.events.pull(event);
		user.save();
	})

	for (let partId of event.participants ) {
		// console.log("in participants", partId);
		User.findById(partId,function( err, user) {
			// console.log("removing participant", user, event);
			user.events.pull(event);
			user.save();
		})
	}

})

module.exports = mongoose.model('Event',  // creates a collection in the database called 'events'
	schema );