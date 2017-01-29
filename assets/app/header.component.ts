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
			</ul>
		</nav>
		<span class="col-md-2">{{whoIsLoggedIn()}}</span>
		</header>
	`
})

export class HeaderComponent {

	constructor ( private authService: AuthService){}

	whoIsLoggedIn (){
		return this.authService.whoIsLoggedIn().email;
	}
	
}