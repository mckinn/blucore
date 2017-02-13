// event-list.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { EventService } from "./event.service";
import { AuthService } from "../auth/auth.service";
import { Event } from "./event.model";

@Component ({
	selector: 'app-event-list',
	templateUrl: './event-list.component.html'
})

export class EventListComponent implements OnInit {

	events: Event[];
	searchForm: FormGroup;
    constructor( private eventService: EventService, private authService: AuthService ) {}

    ngOnInit () {

		if (!this.searchForm) {
			this.searchForm = new FormGroup({
				textSearch: new FormControl(null, null),
				teacherSearch: new FormControl(null, null)
			})
		}
		console.log("calling geteventS");
    	this.eventService.getEvents()
    		.subscribe(
    			(events: Event[]) => {
    				console.log('* * * * eventlist on nginit * * * *');
    				console.log(events);
    				this.events = events;
    			}
    		);
    }
}