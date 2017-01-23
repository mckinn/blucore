// event-input.component.ts

import { Component, OnInit } from "@angular/core";

import { FormGroup, FormControl, Validators, NgForm } from "@angular/forms";
import { EventService } from "./event.service";
import { Event } from "./event.model";


@Component ({
	selector: 'app-event-input',
	templateUrl: './event-input.component.html' 

})

export class EventInputComponent implements OnInit {

	event:Event; 
	myForm: FormGroup;

	constructor(private eventService: EventService){}

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

	ngOnInit() {
		this.myForm = new FormGroup({
			eventName: new FormControl(null, Validators.required),
			eventDescription: new FormControl(null, Validators.required),
			eventDate: new FormControl(null, Validators.required),
			eventTime: new FormControl(null, Validators.required),
			eventDuration: new FormControl(null, Validators.required),
			eventSchool: new FormControl(null, Validators.required)
		});
		console.log("* * * * ngOnInit * * * *");
		console.log(this.myForm);
		console.log("* * * * ngOnInit * * * *");
		this.eventService.eventEditHappened.subscribe(
				(event:Event) => {
					console.log("* * * * eventEditHappened * * * *");
					console.log(event);
					this.event = event;
					this.myForm.setValue({
						eventName: event.name,
						eventDescription: event.description,
						eventDate: event.date,
						eventTime: event.time,
						eventDuration: event.duration,
						eventSchool: event.school
					});
					console.log(this.myForm);
				}
			);
	}
}