// logout.component.ts

import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service" ;

@Component ({
	selector: 'app-logout',
	template: `
		<div class="col-md-12">
			<button class = "btn btn-danger" (click) = "onLogout()">Logout</button>
		</div>
	`
})

export class LogoutComponent {

	constructor( private authService: AuthService, private router: Router) {}

	onLogout() {
		this.authService.logout();
		// console.log("this.router.navigate(['/authentication', 'signin']);");
		this.authService.clearWhoIsLoggedIn();
		this.router.navigate(['/authentication', 'signin']);
	}
}