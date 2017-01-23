// event-list.component.ts

import { Component, OnInit } from "@angular/core";

import { EventService } from "./event.service";
import { Event } from "./event.model";

@Component ({
	selector: 'app-event-list',
	template: `
		<div class = "col-md-8 col-md-offset-2">
			<table class="table table-hover">
			    <thead>
					<tr>
						<th>Name:id</th>
						<th>Date</th>
						<th>Time</th>
						<th>Duration</th>
						<th>School</th>
						<th>Teacher</th>
						<th>Actions</th>
					</tr>
			    </thead>
			    <tbody>
					<tr *ngFor="let evt of events" app-event [event]="evt">
					</tr>
				</tbody>
			</table>
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
    				console.log('* * * * eventlist on nginit * * * *');
    				console.log(events);
    				this.events = events;
    			}
    		);
    }
}