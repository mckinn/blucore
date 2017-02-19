// authentication.component.ts
import { Component } from "@angular/core";

import { AuthService } from "./auth.service";

@Component ({
	selector: 'app-authentication',
	template: `
		<header class="row spacing">
			<nav class="col-md-6 col-md-offset-2">
				<ul class="nav nav-tabs"> 
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['edit']">Sign Up  </a></li>
					<li routerLinkActive="active" *ngIf="isLoggedIn()"> <a [routerLink]="['edit']">User Details</a></li>
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['signin']">Sign In  </a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedInAdmin()"><a [routerLink]="['users' ]">User List</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn()"><a [routerLink]="['eventsMenu']">Events</a></li>
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
							<li> <a class="text-right" [routerLink]="['email']">email</a></li>
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

export class AuthenticationComponent {

	constructor (private authService: AuthService) {}

	isLoggedIn () {
		return this.authService.isLoggedIn();
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

}
