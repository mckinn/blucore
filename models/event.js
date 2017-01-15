// event.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');

var schema = new Schema({
	content: {type: String, required: true},
	user: {type: Schema.Types.ObjectId, ref: 'User'} // ObjectID is an internal GUID	
});

schema.post('remove', function (event){
	User.findById(event.user, function( err, user) {
		user.events.pull(event);
		user.save();
	})
})

module.exports = mongoose.model('Event',  // creates a collection in the database called 'events'
	schema );