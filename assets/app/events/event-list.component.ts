// event-list.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl,NgForm, FormsModule } from "@angular/forms";

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


	onSearch () {
		let queryParms: string[] = [];
		if (this.searchForm.get("textSearch").value) queryParms.push('text='+
			this.searchForm.get("textSearch").value);
		if (this.searchForm.get("teacherSearch").value) queryParms.push('teacher='+
			this.searchForm.get("teacherSearch").value);
		this.eventService.getEvents(queryParms)
    		.subscribe(
    			(events: Event[]) => {
    				// console.log('* * * * eventlist on search * * * *');
    				// console.log(events);
    				this.events = events;
    			}
    		);
		this.searchForm.reset();
	}

	onClear () {
		this.eventService.getEvents()
    		.subscribe(
    			(events: Event[]) => {
    				// console.log('* * * * eventlist on clear * * * *');
    				// console.log(events);
    				this.events = events;
    			}
    		);
		this.searchForm.reset();
	}


    ngOnInit () {

		if (!this.searchForm) {
			this.searchForm = new FormGroup({
				textSearch: new FormControl(null, null),
				teacherSearch: new FormControl(null, null)
			})
		}
		// console.log("calling geteventS");
    	this.eventService.getEvents()
    		.subscribe(
    			(events: Event[]) => {
    				// console.log('* * * * eventlist on nginit * * * *');
    				// console.log(events);
    				this.events = events;
    			}
    		);
    }
}