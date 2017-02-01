// events.component.ts
import { Component } from "@angular/core";

import {AuthService} from "../auth/auth.service";

@Component({
	selector: 'app-events', 
	template: `
		<header class="row spacing">
			<nav class="col-md-8 col-md-offset-2">
				<ul class="nav nav-tabs"> 
					<li routerLinkActive="active" *ngIf= "activeForTeachers()"><a [routerLink]="['input']">Event Details</a></li>
					<li routerLinkActive="active" class="disabled" *ngIf= "!activeForTeachers()"><a>Event Details</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn()"><a [routerLink]="['list']">All Events</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn() && !isAdmin()"><a [routerLink]="['mylist']">My Events</a></li>
				</ul>
			</nav>
		</header>
		<div class="row spacing">
			<router-outlet></router-outlet>
		</div>
	`


})
export class EventsComponent {


	constructor (private authService: AuthService) {}

	isLoggedIn () {
		return this.authService.isLoggedIn();
	}

	activeForTeachers(){
		// console.log("* * * * active for teacher * * * *",this.authService.whoIsLoggedIn().kind);
		if (this.authService.isLoggedIn()) {
			return (this.authService.whoIsLoggedIn().kind == 'teacher');
		}
		return false;
	}

	isAdmin(){
		// console.log("* * * * is admin* * * *",this.authService.whoIsLoggedIn().kind);
		if (this.authService.isLoggedIn()) {
			return (this.authService.whoIsLoggedIn().kind == 'admin');
		}
		return false;
	}

}