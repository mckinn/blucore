// event-input.component.ts

import { Component, OnInit } from "@angular/core";

import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Location } from "@angular/common"; 
import { EventService } from "./event.service";
import { AuthService } from "../auth/auth.service";
import { SchoolService } from "../schools/school.service";
import { Event } from "./event.model";
import { School } from "../schools/school.model";
import { User } from "../auth/user.model";
// import { EventParticipant } from "./event.participant.component";

import 'rxjs/add/operator/switchMap';


@Component({
	selector: 'app-event-input',
	templateUrl: './event-input.component.html'

})

export class EventInputComponent implements OnInit {

	event: Event;
	myForm: FormGroup;
	isLocked: boolean;
	closed: boolean;
	private initComplete: boolean;
	eventParticipants: User[];
	eventAttendees: User[];
	schoolList: School[] = [];

	constructor(
		private eventService: EventService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private schoolService: SchoolService) { }

	onSubmit() {
		console.log("* * * * onSubmit * * * *");
		console.log(this.myForm.value, this.authService.whoIsLoggedIn());
		console.log("* * * * onSubmit * * * *");
		if (this.event) {
			//edit
			// updates the event pointed to by the this.event
			console.log("Before filling",this.event, this.authService.whoIsLoggedIn());

			if ((this.event.closed != this.myForm.value.eventClosed) && (this.authService.whoIsLoggedIn().kind == 'teacher')) {
				this.authService.toggleEventOpenClosed ( this.event, this.myForm.value.eventClosed );
			}

			console.log("updated event: ", this.event);

			this.event.name = this.myForm.value.eventName;
			// reset the reference, now that the content has changed
			// update the event in the event service
			this.event.description = this.myForm.value.eventDescription;
			this.event.date = this.myForm.value.eventDate;
			// no update because we will auto-generate it.
			// this.event.eventNumber = this.myForm.value.event.eventNumber;
			this.event.time = this.myForm.value.eventTime;
			this.event.duration = this.myForm.value.eventDuration;
			this.event.school = this.myForm.value.eventSchool;
			this.event.roomNumber = this.myForm.value.eventRoomNumber;
			this.event.participantCount = this.myForm.value.eventParticipantCount   // ToDo - make sure that the Form is good
			this.event.closed = this.myForm.value.eventClosed;
			
			console.log("After filling",this.event);

			this.eventService.updateEvent(this.event)
				.subscribe(
					result => {
						result; 
						// console.log(result)
				});
			// here's the fun part - any user that has swapped lists needs updating - 
			// we need to do that in the server.
			
			this.event = null;
		} else {
			// new.  
			// ToDo - change the '0' to a value that we persist and increment.
			const event = new Event(
				this.myForm.value.eventName,
				this.myForm.value.eventDescription,
				this.myForm.value.eventDate,
				0,     // event number - todo later.
				" 0 ", // eventId does not matter because server fills it
				this.myForm.value.eventTime,
				this.myForm.value.eventDuration,
				this.myForm.value.eventSchool,
				this.myForm.value.eventRoomNumber,
				this.myForm.value.eventParticipantCount,
				this.myForm.value.closed
				// need to find the user that is creating this
			);
			console.log("* * * * before addEvent * * * *",event);
			this.eventService.addEvent(event)
				.subscribe(
				data => // console.log(data),
				error => console.error(error)
				);
		}

		this.myForm.reset();
		this.myForm.enable();
		this.location.back();
	}


	onJoin() {
		// basically - add the current event to the user's queue, and 
		// add the user to the list of users for the event.
		// this needs to wait until we have the roles stuff sorted out.
		console.log("event being claimed ", this.event);
		this.authService.claimEvent(this.event)
			/*.subscribe(
			// result => console.log("* * * * subscription in claimEvent * * * *", result),
			error => console.error("error in subscription in claimEvent", error)
			);*/

	}

	onClear(form: NgForm) {
		this.myForm.reset();
		this.myForm.enable();
		this.event = null;
	}

	goBack() {
		this.location.back();
	}

	isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}

	logIt() {
		console.log("in logit");
		console.log("logit form:",this.myForm.value);
		console.log("logit user:",this.authService.whoIsLoggedIn());
	}

	isNotMine(event: Event) {
		return (this.authService.whoIsLoggedIn().userId != event.ownerId);
	}

	iAmATeacher() {
		// // console.log("* * * * I am a teacher * * * *",this.authService.whoIsLoggedIn().kind);
		return (this.authService.whoIsLoggedIn().kind == 'teacher');
	}
	
	tooManySignedUpAlready() {
		console.log("* * * * how many signed in * * * *",this.event.name, this.event.participantCount, this.event.participants.length);
		return (this.event.participantCount <= this.event.participants.length);
	}

	iAmAStudent() {
		// console.log("* * * * I am a student * * * *",this.authService.whoIsLoggedIn().kind);
		return (this.authService.whoIsLoggedIn().kind == 'student');
	}

	iHaveNotSelectedThis() {
		// something is going on with respect to settling the input values here.
		// It is possible that the eventIs is not yet settled.
		// we might have to change strategies to set something up explicitly
		// as part of the OnInit.
		// // console.log("in iHaveNotSelectedThis ")
		if (this.event) { 
			// // console.log("this.event exists",this.event.eventId); 
			return ( this.authService.notInMyPlannedList(this.event.eventId) && 
					 this.authService.notInMyAttendedList(this.event.eventId)  );
			}
		// // console.log("bailing because eventId is not stable");
		return false;
	}

	populateParticipants() { // fills the participant list at the bottom of the form.

		if(this.event) {
			this.authService.getUsers()
				.subscribe( (users :User[]) => {
					for (let user of users) {
						// console.log("scanning users for participants", user.userId, this.event.participants);
						if (this.event.participants.find(
							function(participant: string) {
								// console.log("participant: ",userId,"user of total user list: ",user.userId)
								return participant == user.userId;
							}
						)){
							/*this.eventParticipants.push( { name:user.firstName + " " + user.lastName,
														   attended: true,
														   userId: user.userId });*/
							this.eventParticipants.push(user); // set up the entire user.
							console.log("adding user",user.userId, user.firstName, user.lastName);
						}
						if (this.event.attendedList.find(
							function(participant: string) {
								// console.log("attendee: ",userId,"user of total user list: ",user.userId)
								return participant == user.userId;
							}
						)){
							/*this.eventParticipants.push( { name:user.firstName + " " + user.lastName,
														   attended: true,
														   userId: user.userId });*/
							this.eventAttendees.push(user); // set up the entire user.
							console.log("adding user",user.userId, user.firstName, user.lastName);
						}
						
					}
					// console.log("participants: ",this.eventParticipants);
					this.initComplete = true;
				})
			}
		
	}

	getFirstSchool() {
		return this.schoolList[0];
	}

	ngOnInit() {
		this.initComplete = false;
		this.eventParticipants = [];
		this.eventAttendees = [];

		// console.log("* * * * IC - ngOnInit - input start * * * *");
		if (!this.myForm) {
			// console.log("* * * creating a formgroup * * *");
			this.myForm = new FormGroup({
				eventName: new FormControl(null, Validators.required),
				eventDescription: new FormControl(null, Validators.required),
				eventDate: new FormControl(null, Validators.required),
				eventTime: new FormControl(null, Validators.required),
				eventDuration: new FormControl(null, Validators.required),
				eventSchool: new FormControl(null),
				eventRoomNumber: new FormControl(null, Validators.required),
				eventParticipantCount: new FormControl(null, Validators.required),
				eventClosed: new FormControl (null)
			});
		};

		if ((!this.schoolList) || (this.schoolList.length == 0)) {
			this.schoolService.getSchools()
				.subscribe(
					(schools: School[]) => {
						// console.log('* * * * eventlist on search * * * *');
						// console.log(events);
						this.schoolList = schools;
					}
				);
		}

		console.log("in event - list of schools:", this.schoolList);
		console.log("in event - myForm Values: ", this.myForm);
		console.log("in event - event Values: ", this.event);

		// console.log(this.route.params);
		// console.log(this.route.url);
		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			// console.log("* * * * IC - params * * * *",this.route.snapshot.params['eventId']);
			// this.route.params.switchMap((params: Params) => {
			return this.eventService.getEvent(this.route.snapshot.params['eventId'])
			// })
				.subscribe((event: Event) => {
					console.log("* * * * IC - subscription activation * * * *",this.myForm,event);
					if (event) {   // if there actually was a parameter...
						this.event = event;
						this.myForm.setValue({
							eventName: event.name,
							eventDescription: event.description,
							eventDate: event.date,
							eventTime: event.time,
							eventDuration: event.duration,
							eventSchool: event.school,
							eventRoomNumber: (event.roomNumber || "no room specified"),
							eventParticipantCount: (event.participantCount || 0 ),
							eventClosed: (event.closed || false)
						});
						this.populateParticipants();
					}
					console.log("* * * * IC - subscription activation 2 * * *",this.myForm,event);
					// the form is diabled if it is filled with data and not owned by me.
					if (this.isNotMine(this.event)) {
						// console.log("disable");
						this.myForm.disable();
					}

					// console.log("* * * * ngOnInit - end * * * *");
					// console.log(this.myForm);
				});
		} else {
			this.myForm.patchValue({school:this.schoolList[0]});
			console.log("new form:", this.myForm);
		};	

	}
}