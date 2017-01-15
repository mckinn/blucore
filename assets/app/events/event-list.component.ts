// event-list.component.ts

import { Component, OnInit } from "@angular/core";

import { EventService } from "./event.service";
import { Event } from "./event.model";

@Component ({
	selector: 'app-event-list',
	template: `
		<div class = "col-md-8 col-md-offset-2">
			<!-- msgs is defined as a Event in mesage=-list.component.ts -->
			<!-- eventClicked is defined in EventListComponent, as is msgalias -->
			<app-event 
				[event]="event" 
				*ngFor="let event of events" 
			>
			</app-event>
		</div>
	`
})

export class EventListComponent implements OnInit {

	events: Event[];
    constructor( private eventService: EventService ) {}

    ngOnInit () {
    	this.eventService.getEvents()
    		.subscribe(
    			(events: Event[]) => {
    				this.events = events;
    			}
    		);
    }
}