// event.component.ts
import { Component, Input, OnInit } from "@angular/core";
// import { Router } from "@angular/router";

import { Event } from "./event.model";
import { User } from "../auth/user.model";
import { EventService } from "./event.service";
// import { AuthService } from "../auth/auth.service";

@Component ({
	selector: '[app-participant]', 
	template: `
		<td class = "col-md-8">
			<div>
				<span>{{participantName}}</span>
			</div>
		</td>
		<td class="checkbox col-md-4">
			<div>
				<label>
					<input type="checkbox" [checked]="attended"  [disabled] = "disableBoxes()" (change)="onSelect($event)">
					Attended
				</label>
			</div>
		</td>
	`


})

export class EventParticipant implements OnInit {
	
	@Input() userAttended: User;
	@Input() eventEditing: Event;
	@Input() attended: boolean;
	participantName: string;
	@Input() teacher: boolean;

   constructor( 
   				private eventService: EventService
				){}
			
	onSelect(event) {
		// console.log("in Select: ",this.userAttended);
		// console.log("in Select - event: ",event.srcElement.checked, event);
		// we don't care what list they were on, only what they will be on (based on the event)
		// If the event is select then move them to attendee, otherwise move them to participant.
		// create a event that will be subscribed to in the context of the event, and pass the user
		// and new state (or perhaps two events)
		this.eventService.swapParticipants( this.eventEditing,           // update the event's lists of participants
											this.userAttended,
		  							 		event.srcElement.checked );  // the value of the check-box --> moveToAttended
		// the users will get adjusted on the server when the new event is uploaded.
    }

	disableBoxes() {
		return !this.teacher; // ToDo - determine this based on whether the teacher is executing the change
	}

	ngOnInit () {
		// console.log("in participant: ",this.attended ,this.userAttended, this.eventEditing );
		// this.attended = false;  // for now
		this.participantName = this.userAttended.firstName + " " + this.userAttended.lastName;
		// console.log("in participant onInit: ", this.attended, this.participantName );
	}

}
