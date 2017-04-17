
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { EventService } from "./event.service";
import { AuthService } from "../auth/auth.service";
import { ErrorService } from "../errors/error.service";
import { Event } from "./event.model";
import { User } from "../auth/user.model";

@Component ({
	selector: 'app-event-list',
	template: `
		<div class = "col-md-8 col-md-offset-2">
			<table class="table table-hover panel-body">
			    <thead>
					<tr>
						<th>Event</th>
						<th>Date</th>
						<th>Time</th>
						<th>Duration</th>
						<th>School</th>
						<th>Teacher</th>
						<th>Complete</th>
						<th>Actions</th>
					</tr>
			    </thead>
			    <tbody>
					<tr><td><span>Planned</span></td></tr>
					<tr *ngFor="let evt of plannedEvents" app-event [rowevent]="evt" [attended]=false></tr>
					<tr><td><span>Completed</span></td></tr>
					<tr *ngFor="let evt of attendedEvents" app-event [rowevent]="evt" [attended]=true></tr>
				</tbody>
			</table>
		</div>

	`
})

export class MyEventListComponent implements OnInit {

	plannedEvents: Event[];
	attendedEvents: Event[];
    constructor( private eventService: EventService, 
				 private authService: AuthService,
				 private errorService: ErrorService,
				 private router: Router ) {}

    ngOnInit () {

		if (!this.authService.isLoggedIn()) {
			console.log("re-setting user due to logout");
			this.errorService.handleError(
				this.errorService.loginTimeoutError
			);
			this.router.navigate(['/authentication/signin']);
			return;
		}

        const user: User = this.authService.whoIsLoggedIn();
        if (user) {  // somebody is logged in...
            // console.log("somebody is logged in");
            // console.log( user );
        
			this.plannedEvents = [];
			this.attendedEvents = [];
			this.authService.getUser(user.userId)   // get the user data
				.subscribe(
					(user: User) => {
						console.log('* * * * building user event list * * * *');
						console.log(user);
						for (let evt of user.myEvents) {
							console.log(evt);
							this.eventService.getEvent(evt).subscribe (
								event => {
									this.plannedEvents.push(event);
									console.log("current planned events");
									console.log(this.plannedEvents);
								}
							)
						}
						for (let evt of user.attendedEvents) {
							console.log(evt);
							this.eventService.getEvent(evt).subscribe (
								event => {
									this.attendedEvents.push(event);
									console.log("current attended events");
									console.log(this.attendedEvents);
								}
							)
						}
					}
				);
		}
    }
}