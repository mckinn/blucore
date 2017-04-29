// event.component.ts
import { Component, OnInit, Input } from "@angular/core";
// import { Router } from "@angular/router";

import { Event } from "../event.model";
// import { User } from "../../auth/user.model";
// import { EventService } from "../event.service";
import { MyEventListComponent } from "../myevent-list.component";

@Component ({
	selector: 'app-event-footer', 
    providers: [MyEventListComponent, Event],
	template: `
        <div class = "col-md-8 col-md-offset-2">
            <div class = "col-md-4">
                <label>Activities Completed:</label>{{activitiesCompleted}}
                <label>Hours Completed:</label>{{hoursCompleted}}
                <label>Activities Planned:</label>{{activitiesPlanned}}
                <label>Hours Planned:</label>{{activitiesCompleted}}
            </div>  
        </div>
	`
})


// ToDo - either make it part of the host component, or find a way to pass the values in to the component
//        to see if that helps.

export class EventFooterComponent implements OnInit {
	

    @Input() plannedEvents: Event[];
    @Input() attendedEvents: Event[];

    activitiesCompleted: number;
    hoursCompleted: number;
    activitiesPlanned: number;
    hoursPlanned: number;

    constructor( 
   				private event: Event
				){}

	ngOnInit () {

        this.activitiesCompleted = this.hoursCompleted = this.activitiesPlanned = this.hoursPlanned = 0;

        console.log("the event lists: ",this.plannedEvents, this.attendedEvents )
		
        for (let event of this.plannedEvents) {
            this.activitiesPlanned = this.activitiesPlanned++;
            this.hoursPlanned = this.hoursPlanned + event.duration;
        }

       for (let event of this.attendedEvents) {
            this.activitiesCompleted = this.activitiesCompleted++;
            this.hoursCompleted = this.hoursCompleted + event.duration;
        }
	}

}
