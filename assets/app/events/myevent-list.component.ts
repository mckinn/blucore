
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
					<tr><td colspan="8"><span><strong>Planned</strong></span></td></tr>
					<tr *ngFor="let evt of plannedEvents" app-event [rowevent]="evt" [attended]=false></tr>
					<tr><td colspan="8"><span><strong>Completed</strong></span></td></tr>
					<tr *ngFor="let evt of attendedEvents" app-event [rowevent]="evt" [attended]=true></tr>
				</tbody>
			</table>
		</div>
		<div class = "col-md-8 col-md-offset-2">
            <div>
				<table class="table">
					<tr><td>Activities Completed</td><td>{{activitiesCompleted}}</td></tr>
					<tr><td>Hours Completed:</td><td>{{hoursCompleted}}</td></tr>
					<tr><td>Activities Planned:</td><td>{{activitiesPlanned}}</td></tr>
					<tr><td>Hours Planned:</td><td>{{hoursPlanned}}</td></tr>
				</table>
            </div>  
        </div>
	`
})

export class MyEventListComponent implements OnInit {

	public plannedEvents: Event[];
	public attendedEvents: Event[];

	public activitiesCompleted: number;
    public hoursCompleted: number;
    public activitiesPlanned: number;
    public hoursPlanned: number;

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

		this.activitiesCompleted = this.hoursCompleted = this.activitiesPlanned = this.hoursPlanned = 0;

        const user: User = this.authService.whoIsLoggedIn();
		console.log("the logged in user: ",user);
        if (user) {  
        
			this.plannedEvents = [];
			this.attendedEvents = [];
			
			this.authService.getUser(user.userId)   // get the user data
				.subscribe(
					(user: User) => {
						console.log("the user fetched from the database: ",user);
						for (let evt of user.myEvents) {
							this.eventService.getEvent(evt).subscribe (
								event => {
									this.plannedEvents.push(event);
									this.activitiesPlanned = this.activitiesPlanned + 1;
									this.hoursPlanned = this.hoursPlanned + (parseInt(event.duration)/60);
								}
							)
						}
						this.hoursPlanned = Math.round(this.hoursPlanned/60);

						for (let evt of user.attendedEvents) {
							this.eventService.getEvent(evt).subscribe (
								event => {
									this.attendedEvents.push(event);
									this.activitiesCompleted = this.activitiesCompleted + 1;
									this.hoursCompleted = this.hoursCompleted + (parseInt(event.duration)/60);

								}	
								
							)
						}
					}
					
				);
				
		}
    }
}