// event-input.component.ts

import { Component, OnInit } from "@angular/core";

import { NgForm } from "@angular/forms";
import { EventService } from "./event.service";
import { Event } from "./event.model";


@Component ({
	selector: 'app-event-input',
	templateUrl: './event-input.component.html' 

})

export class eventInputComponent implements OnInit {

	event:Event; // default is undefined

	constructor(private eventService: EventService){}

	onSubmit(form:NgForm){
		console.log(form);
		if (this.event) {
			//edit
			// updates the event pointed to by the this.event
			this.event.content = form.value.myContent;
			// reset the reference, now that the content has changed
			// update the event in the event service
			this.eventService.updateEvent(this.event)
				.subscribe(
					result => console.log(result)
				);
			this.event = null;
		} else {
			// new
	 		const event = new Event( form.value.myContent, "SteveM");
	 		this.eventService.addEvent(event)
	 			.subscribe(
	 				data => console.log(data),
	 				error => console.error(error)
	 			);
		}

 		form.resetForm();
	}

	onClear(form: NgForm){
		form.resetForm();
		this.event = null;
	}

	ngOnInit() {
		this.eventService.eventEditHappened.subscribe(
				(event:Event) => this.event = event
			)
	}
}