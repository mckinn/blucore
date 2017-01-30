// event-input.component.ts

import { Component, OnInit } from "@angular/core";

import { FormGroup, FormControl, Validators, NgForm, AbstractControl } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EventService } from "./event.service";
import { AuthService } from "../auth/auth.service";
import { Event } from "./event.model";

import 'rxjs/add/operator/switchMap';


@Component({
	selector: 'app-event-input',
	templateUrl: './event-input.component.html'

})

export class EventInputComponent implements OnInit {

	event: Event;
	myForm: FormGroup;
	isLocked: boolean;

	constructor(
		private eventService: EventService,
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute) { }

	onSubmit() {
		console.log("* * * * onSubmit * * * *");
		console.log(this.myForm);
		console.log("* * * * onSubmit * * * *");
		if (this.event) {
			//edit
			// updates the event pointed to by the this.event
			console.log(this.event);
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

			this.eventService.updateEvent(this.event)
				.subscribe(
				result => console.log(result)
				);
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
				this.myForm.value.eventSchool
				// need to find the user that is creating this
			);
			console.log("* * * * before addEvent * * * *");
			console.log(event);
			this.eventService.addEvent(event)
				.subscribe(
				data => console.log(data),
				error => console.error(error)
				);
		}

		this.myForm.reset();
		this.myForm.enable();
	}


	onJoin() {
		// basically - add the current event to the user's queue, and 
		// add the user to the list of users for the event.
		// this needs to wait until we have the roles stuff sorted out.

		this.authService.claimEvent(this.event)
			.subscribe(
			result => console.log("* * * * subscription in claimEvent * * * *", result),
			error => console.error("error in subscription in claimEvent", error)
			);

	}

	onClear(form: NgForm) {
		this.myForm.reset();
		this.myForm.enable();
		this.event = null;
	}

	isEmpty(obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}

	isNotMine(event: Event) {
		return (this.authService.whoIsLoggedIn().userId != event.ownerId);
	}

	iAmATeacher() {
		// console.log("* * * * I am a teacher * * * *",this.authService.whoIsLoggedIn().kind);
		return (this.authService.whoIsLoggedIn().kind == 'teacher');
	}

	iAmAStudent() {
		console.log("* * * * I am a student * * * *",this.authService.whoIsLoggedIn().kind);
		return (this.authService.whoIsLoggedIn().kind == 'student');
	}

	iHaveNotSelectedThis() {
		// something is going on with respect to settling the input values here.
		// It is possible that the eventIs is not yet settled.
		// we might have to change strategies to set something up explicitly
		// as part of the OnInit.
		// console.log("in iHaveNotSelectedThis ")
		if (this.event) { 
			// console.log("this.event exists",this.event.eventId); 
			return this.authService.notInMyList(this.event.eventId);
			}
		// console.log("bailing because eventId is not stable");
		return false;
	}

	ngOnInit() {
		console.log("* * * * IC - ngOnInit - input start * * * *");
		if (!this.myForm) {
			console.log("* * * creating a formgroup * * *");
			this.myForm = new FormGroup({
				eventName: new FormControl(null, Validators.required),
				eventDescription: new FormControl(null, Validators.required),
				eventDate: new FormControl(null, Validators.required),
				eventTime: new FormControl(null, Validators.required),
				eventDuration: new FormControl(null, Validators.required),
				eventSchool: new FormControl(null, Validators.required)
			});

		};
		console.log(this.route.params);
		console.log(this.route.url);
		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			console.log("* * * * IC - params * * * *",this.route.snapshot.params['eventId']);
			// this.route.params.switchMap((params: Params) => {
			return this.eventService.getEvent(this.route.snapshot.params['eventId'])
			// })
				.subscribe((event: Event) => {
					console.log("* * * * IC - subscription activation * * * *");
					console.log(this.myForm);
					console.log(event);
					if (event) {   // if there actually was a parameter...
						this.event = event;
						this.myForm.setValue({
							eventName: event.name,
							eventDescription: event.description,
							eventDate: event.date,
							eventTime: event.time,
							eventDuration: event.duration,
							eventSchool: event.school
						});
					}
					// the form is diabled if it is filled with data and not owned by me.
					if (this.isNotMine(this.event)) {
						console.log("disable");
						this.myForm.disable();
					}

					console.log("* * * * ngOnInit - end * * * *");
					console.log(this.myForm);
				});
		}
	}
}