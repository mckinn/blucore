
import { Component, OnInit } from "@angular/core";

import { EventService } from "./event.service";
import { AuthService } from "../auth/auth.service";
import { Event } from "./event.model";
import { User } from "../auth/user.model";

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

export class MyEventListComponent implements OnInit {

	events: Event[];
    constructor( private eventService: EventService, private authService: AuthService ) {}

    ngOnInit () {
        const user: User = this.authService.whoIsLoggedIn();
        if (user) {  // somebody is logged in...
            console.log("somebody is logged in");
            console.log( user );
        
			this.events = [];
			this.authService.getUser(user.userId)   // get the user data
				.subscribe(
					(user: User) => {
						console.log('* * * * building user event list * * * *');
						console.log(user);
						for (let evt of user.myEvents) {
							console.log(evt);
							this.eventService.getEvent(evt).subscribe (
								event => {
									this.events.push(event);
									console.log("current events");
									console.log(this.events);
								}
							)
						}
					}
				);
		}
    }
}