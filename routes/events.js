var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var Event = require('../models/event');
var User = require('../models/user');

router.get('/', function(req,res,next){
	Event.find()
		.populate('ownerId')
		.exec(function(err,events){
			if (err) {
				return res.status(500).json({
				title: 'an error occurred',
				error: err
				});
			}
			res.status(200).json({
				message: 'got the messages',
				obj: events
			});
		});
});

// check for logged in user
router.use('/',function(req,res,next){
	jwt.verify(req.query.token, 'secretkey', function (err, decoded) {
		if (err) {
			return res.status(401).json({
				title:'user no longer logged in',
				error: err
			});
		};
		next();
	})
});

// create an event
router.post('/', function (req, res, next) {
	console.log(req);
	var decoded = jwt.decode(req.query.token); 
	User.findById(decoded.user._id, function(err, user){
		if (err) {
			return res.status(500).json({
				title:'cannot find user by id',
				error: err
			});
		};
		
		var event = new Event({
			name: req.body.name,
			description: req.body.description,
			date: req.body.date,
			eventNumber: req.body.eventNumber,
			time: req.body.time,
			duration: req.body.duration,
			school: req.body.school,
			ownerId: user
			// _id is auto-populated.
		}); 
		console.log("* * * * new event * * * *");
		console.log(event);
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

router.patch('/:evtId', function (req, res, next) {
	console.log(req.params.evtId);
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
		event.content = req.body.content;
		event.save( function (err, result) {
			if (err) {
				return res.status(500).json({
					title:'An Error Occurred',
					error: err
				});
			};
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
