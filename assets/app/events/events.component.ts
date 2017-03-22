// events.component.ts
import { Component } from "@angular/core";
import { Router } from "@angular/router";

import {AuthService} from "../auth/auth.service";

@Component({
	selector: 'app-events', 
	template: `
		<header class="row spacing">
			<nav class="col-md-8 col-md-offset-2">
				<ul class="nav nav-tabs"> 
					<li routerLinkActive="active" *ngIf= "activeForTeachers() && isLoggedIn() && isValidatedUser()"><a [routerLink]="['input']">New Event</a></li>
					<li routerLinkActive="active" class="disabled" *ngIf= "!activeForTeachers() && isLoggedIn()"><a>Event Details</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn() && isValidatedUser()"><a [routerLink]="['list']">All Events</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn() && !isAdmin() && isValidatedUser()"><a [routerLink]="['mylist']">My Events</a></li>
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['signin']">Sign In</a></li>
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['edit']">Sign Up</a></li>
					<li routerLinkActive="active" *ngIf="isLoggedIn()"> <a [routerLink]="['edit']">User Details</a></li>
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
							<li> <a class="text-right" >{{roleIsLoggedIn()}}</a></li>
							<li> <a class="text-right" [routerLink]="['edit']">User Details</a></li>
							<li (click)="onLogout()"> <a href=#  class="text-right">Logout</a></li>
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


	constructor (private authService: AuthService, 
				 private router: Router) {}

	isLoggedIn () {
		return this.authService.isLoggedIn();
	}

	activeForTeachers(){
		// // console.log("* * * * active for teacher * * * *",this.authService.whoIsLoggedIn().kind);
		if (this.authService.isLoggedIn()) {
			return (this.authService.whoIsLoggedIn().kind == 'teacher');
		}
		return false;
	}

	isAdmin(){
		// // console.log("* * * * is admin* * * *",this.authService.whoIsLoggedIn().kind);
		if (this.authService.isLoggedIn()) {
			return (this.authService.whoIsLoggedIn().kind == 'admin');
		}
		return false;
	}

	isValidatedUser () {

		// console.log("logged in user: ",this.authService.whoIsLoggedIn());
		if (this.authService.isLoggedIn()) {
			// console.log("valid user: ",this.authService.whoIsLoggedIn().userName,this.authService.whoIsLoggedIn().valid);
			return (this.authService.whoIsLoggedIn().valid);
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
		// // console.log("this.router.navigate(['/authentication', 'signin']);");
		this.authService.clearWhoIsLoggedIn();
		this.router.navigate(['/authentication', 'signin']);
	}

}