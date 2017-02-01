// header.component.ts

import { Component } from "@angular/core";
import { AuthService } from "./auth/auth.service";

@Component ({
	selector: 'app-header',
	template: `
		<header class="row">
			<nav class="col-md-6 col-md-offset-2">
				<ul class = "nav nav-pills">
					<li routerLinkActive="active"><a [routerLink]="['/authentication']">User Manager</a></li>
					<li routerLinkActive="active"><a [routerLink]="['/events']">Event Manager</a></li>
					<li>
						<div class="dropdown">
							<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								Dropdown button
							</button>
							<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<a class="dropdown-item" href="#">Action</a>
								<a class="dropdown-item" href="#">Another action</a>
								<a class="dropdown-item" href="#">Something else here</a>
							</div>
						</div>
					</li>
				</ul>
			</nav>
		</header>
	`
})

export class HeaderComponent {

	constructor ( private authService: AuthService){}

	whoIsLoggedIn (){
		// console.log("in whoIsLoggedIn");
		if (this.authService.isLoggedIn()) {
			// console.log("user email");
			// console.log(this.authService.whoIsLoggedIn().email);
			return this.authService.whoIsLoggedIn().email + " - " +
					this.authService.whoIsLoggedIn().kind;
		} 
		return "";
	}
	
}