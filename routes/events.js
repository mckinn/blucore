var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Event = require('../models/event');
var User = require('../models/user');

router.options('/', function( req, res, next) {  // pre-flight on sign-in
	// console.log("pre-flight on sign-in");
	return res.status(200).json({
		title:'options response'
	});
});

// check for logged in user
router.use('/',function(req,res,next){
	// console.log("checking in events.js: ",req.query.token," or ", req.headers['x-token'] );
    var token = req.body.token || req.query.token || req.headers['x-token'];
	jwt.verify(token, 'secretkey', function (err, decoded) {
		if (err) {
			return res.status(401).json({
				title:'user no longer logged in',
				error: err
			});
		};
		next();
	})
});

router.get('/', function(req,res,next){

	var qparms = req.query;
	var mongooseQuery = {};
	var mongooseQueryList = [];
	// console.log("queryparms",qparms);
	if (qparms) {
		// console.log("qparms",qparms);
		for (var qparm in qparms){
			// console.log("qparm",qparm, qparms[qparm]);
			switch(qparm) {
				case "text":
					// mongooseQuery.description = { $regex: qparms[qparm] }
					mongooseQueryList.push( 
					{description: { $regex: qparms[qparm], $options: "i" }} );
					mongooseQueryList.push( 
							{name: { $regex: qparms[qparm], $options: "i" }} );
					// console.log("mgql1 ",mongooseQueryList);
					break;
				case "teacher":
					mongooseQueryList.push( 
							{ownerName: { $regex: qparms[qparm], $options: "i" }} );
					// console.log("mgql2 ",mongooseQueryList);
					break;
			}
		}
		if (mongooseQueryList.length != 0) mongooseQuery = {$or: mongooseQueryList};
		// console.log("aggregate",mongooseQuery);
	}

	Event.find(mongooseQuery)
		.sort({date:1})
		.populate('ownerId')
		.exec(function(err,events){
			if (err) {
				return res.status(500).json({
				title: 'an error occurred',
				error: err
				});
			}
			res.status(200).json({
				message: 'got the event(s)',
				obj: events
			});
		});
});


// create an event
router.post('/', function (req, res, next) {
	// console.log(req);
	var token = req.body.token || req.query.token || req.headers['x-token'];
	var decoded = jwt.decode(token); 
	User.findById(decoded.user._id, function(err, user){
		if (err) {
			return res.status(500).json({
				title:'cannot find user by id',
				error: err
			});
		};

		// console.log(" after FindById: - user is: ",user);
		
		var event = new Event({
			name: req.body.name,
			description: req.body.description,
			date: req.body.date,
			eventNumber: req.body.eventNumber,
			time: req.body.time,
			duration: req.body.duration,
			school: req.body.school,
			roomNumber: req.body.roomNumber,
			participantCount: req.body.participantCount,
			closed: req.body.closed,
			ownerName: user.firstName + " " + user.lastName,  // only set once
			ownerId: user._id  // only set once
			// _id is auto-populated.
		}); 
		// console.log("* * * * new event * * * *");
		// console.log(event);
		event.save( function (err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred',
					error: err
				});
			};
			// this should be the user that created the event, and thus it should be in the 
			// user's events list.
			user.events.push(result); 
			user.save();
			res.status(201).json({
				message: 'Saved Event',
				obj: result
			});
		});
	});
});

router.get('/:evtId', function (req, res, next) {
	// console.log(req.params.evtId);
	Event.findById(req.params.evtId)
		.populate('ownerId')
		.exec( function( err , event ){
			if (err) {
				return res.status(500).json({
				title: 'an error occurred in findById',
				error: err
				});
			}
			if (!event) { //no event returned
				return res.status(404).json({
				title: 'cannot find the event',
				error: { message: 'NOT FOUND'}
				});
			}
			// console.log(req.params.evtId);
			res.status(200).json({
				message: 'Updated Event',
				obj: event
			});
		}); 
});

router.patch('/:evtId', function (req, res, next) {
	// console.log(" ------------------------PATCH Event Start------------------------------- ");
	Event.findById(req.params.evtId, function( err , evt ){
		if (err) {
			return res.status(500).json({
				title: 'an error occurred in findById',
				error: err
			});
		}
		if (!evt) { //no event returned
			return res.status(404).json({
				title: 'cannot find the event',
				error: { 'message': 'Event not found: ' + req.params.evtId}
			});
		}
		// console.log("------------------ in patch ------------------");
		// console.log(req.body);
		// console.log("Old: ",evt);

		if( req.body.name ) evt.name = req.body.name;
		if( req.body.description ) evt.description = req.body.description;
		if( req.body.date ) evt.date = req.body.date;
		if( req.body.eventNumber ) evt.eventNumber = req.body.eventNumber;
		if( req.body.time ) evt.time = req.body.time;
		if( req.body.duration ) evt.duration = req.body.duration;
		if( req.body.school ) evt.school = req.body.school;
		if( req.body.participantCount ) evt.participantCount = req.body.participantCount;
		if( req.body.closed != null ) evt.closed = req.body.closed;
		if( req.body.roomNumber ) evt.roomNumber = req.body.roomNumber;
		if( req.body.ownerId ) evt.ownerId = req.body.ownerId;    // never changes
		if( req.body.participants ) evt.participants = req.body.participants;
		if( req.body.attendedList ) evt.attendedList = req.body.attendedList;
		if( req.body.ownerName ) evt.ownerName = req.body.ownerName;

        // console.log(" patching user assignments - New evt: ", evt);
		for (var i=0;i<evt.participants.length;i++) {
			// console.log("Participant: ",evt.participants[i]);
			User.findById(evt.participants[i],function(err,usr){
				if (usr) { // we found the user
					User.ensureEventIdInCorrectList(usr, evt._id, false);
					usr.save( function (err, result) {
						if (err) { console.log(err)	};
						})
				} else {
					console.log( "Missing participant: ", participants[i], " in ", evt );
				}
			})
		};
		for (var i=0;i<evt.attendedList.length;i++) {
			// console.log("Attendee: ",evt.attendedList[i]);
			User.findById(evt.attendedList[i],function(err,usr){
				if (usr) { // we found the user
					User.ensureEventIdInCorrectList(usr, evt._id, true);
					usr.save( function (err, result) {
						if (err) { console.log(err)	};
						})
				} else {
					console.log("Missing attendee: ", attendedList[i], " in ", evt );
				}
			})
		}

		// console.log(evt);
		evt.save( function (err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred',
					error: err
				});
			};
			// console.log(result);
			res.status(200).json({
				message: 'Updated Event',
				obj: result
			});
		});
	}); 
});

router.delete('/:evtId', function (req, res, next) {
	Event.findById(req.params.evtId, function( err , event ){
		if (err) {
			return res.status(500).json({
			title: 'an error occurred in findById',
			error: err
			});
		}
		if (!event) { //no event returned
			return res.status(404).json({
			title: 'cannot find the event',
			error: { message: 'NOT FOUND'}
			});
		}
		event.remove( function (err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred',
					error: err
				});
			};
			res.status(200).json({
				message: 'Deleted Event',
				obj: result
			});
		});
	}); 
});

module.exports = router;
