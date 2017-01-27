// event-input.component.ts

import { Component, OnInit } from "@angular/core";

import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { EventService } from "./event.service";
import { Event } from "./event.model";

import 'rxjs/add/operator/switchMap';


@Component ({
	selector: 'app-event-input',
	templateUrl: './event-input.component.html' 

})

export class EventInputComponent implements OnInit {

	event:Event; 
	myForm: FormGroup;

	constructor(
		private eventService: EventService, 
		private router: Router,
		private route: ActivatedRoute){}

	onSubmit(){
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
				0,
				" 0 ", // does not matter because we don't fill it
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
	}

	onClear(form: NgForm){
		this.myForm.reset();
		this.event = null;
	}

	isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    	}

    	return true;
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
		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			console.log("present");
			console.log(this.route.snapshot.params); 
		}
		console.log(this.route.url);
		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			console.log("* * * * IC - params * * * *");
			this.route.params.switchMap( (params: Params) => {
				return this.eventService.getEvent(params['eventId'])
			})
			.subscribe( (event: Event) => {
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
				console.log("* * * * ngOnInit - end * * * *");
				console.log(this.myForm);
			});
		}
	}
}