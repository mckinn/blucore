// events.component.ts
import { Component } from "@angular/core";
import { Router } from "@angular/router";

import {AuthService} from "../auth/auth.service";

@Component({
	selector: 'app-events', 
	template: `
		<header class="row spacing">
			<nav class="col-md-6 col-md-offset-2">
				<ul class="nav nav-tabs"> 
					<li routerLinkActive="active" *ngIf= "activeForTeachers()"><a [routerLink]="['input']">Event Details</a></li>
					<li routerLinkActive="active" class="disabled" *ngIf= "!activeForTeachers()"><a>Event Details</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn()"><a [routerLink]="['list']">All Events</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn() && !isAdmin()"><a [routerLink]="['mylist']">My Events</a></li>
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['edit']">Sign Up  </a></li>
					<li routerLinkActive="active" *ngIf="isLoggedIn()"> <a [routerLink]="['edit']">User Details</a></li>
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['signin']">Sign In  </a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedInAdmin()"><a [routerLink]="['users' ]">User List</a></li>
				</ul>
			</nav>
			<nav class= "col-md-2" *ngIf="isLoggedIn()">
				<ul class="nav nav-tabs">
					<li role="presentation" class="dropdown">
						<a class="dropdown-toggle" data-toggle="dropdown"  role="button" aria-haspopup="true" aria-expanded="false">
						{{nameIsLoggedIn()}}<span class="caret"></span>
						</a>
						<ul class="dropdown-menu">
							<li class="text-center">{{roleIsLoggedIn()}}</li>
							<li><a class="text-center" [routerLink]="['edit']">User Details</a></li>
							<li class="text-center"><a [routerLink]="['logout']">Logout</a></li>
						</ul>
					</li>
				</ul>
			</nav>
		</header>
		<div class="row spacing">
			<router-outlet></router-outlet>
		</div>
	`


})
export class EventsComponent {


	constructor (private authService: AuthService, private router: Router) {}

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

	isLoggedInAdmin () {
		return this.authService.isLoggedIn()
		&& this.authService.loggedInRole() == 'admin';
	}

	nameIsLoggedIn (){
		if (this.authService.isLoggedIn()) {
			return this.authService.whoIsLoggedIn().firstName;
		} 
		return "";
	}

	roleIsLoggedIn (){
		if (this.authService.isLoggedIn()) {
			return this.authService.whoIsLoggedIn().kind;
		} 
		return "";
	}

	onLogout() {
		this.authService.logout();
		// console.log("this.router.navigate(['/authentication', 'signin']);");
		this.authService.clearWhoIsLoggedIn();
		this.router.navigate(['/authentication', 'signin']);
	}

}