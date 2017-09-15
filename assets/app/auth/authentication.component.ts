// authentication.component.ts
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";

@Component ({
	selector: 'app-authentication',
	template: `
		<header class="row spacing">
			
			<nav class="col-md-7 col-md-offset-2">
				<ul class="nav nav-tabs"> 
					<li routerLinkActive="active"><a [routerLink]="['signin']">Sign In</a></li>
					<li routerLinkActive="active"><a [routerLink]="['edit']">Sign Up</a></li>
				<!--	<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['signin']">Sign In</a></li>
					<li routerLinkActive="active" *ngIf="!isLoggedIn()"><a [routerLink]="['edit']">Sign Up</a></li>  -->
					<!-- <li routerLinkActive="active" *ngIf="isLoggedIn()"> <a [routerLink]="['edit']">User Details</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedInAdmin()"><a [routerLink]="['users' ]">User List</a></li>
					<li routerLinkActive="active" *ngIf= "isLoggedIn()"><a [routerLink]="['eventsMenu']">Events</a></li> -->
				</ul>
			</nav>
			<a href="/events"><img src="/images/apple-small.png" class="col-md-1 center-block img-responsive" style="height:42px;border:0;"></a>
			<!-- <nav class= "col-md-2" *ngIf="isLoggedIn()">
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
			</nav> -->
		</header>
		<div class="row spacing">
			<router-outlet></router-outlet>
		</div>
	`
})

export class AuthenticationComponent implements OnInit{

	constructor (   private authService: AuthService,
					private router: Router
					) {}

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

	ngOnInit() {
		// check to see if we think that we are logged in, and redirect to /events if so.
		if(	this.isLoggedIn() ) {
			console.log("in auth component but logged in - sending to events");
			this.router.navigate(['/events']);
		}
	}
}
