
import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { ErrorService } from "../errors/error.service";
import { User } from "./user.model";

@Component ({
	selector: 'app-user-list',
	template: `
		<div class = "col-md-8 col-md-offset-2">
			<table class="table table-hover">
			    <thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Email</th>
						<th>WCPSS ID</th>
						<th>School</th>
						<th>Kind</th>
					</tr>
			    </thead>
			    <tbody>
					<tr *ngFor="let usr of users" app-user [user]="usr">
					</tr>
				</tbody>
			</table>
		</div>
	`
})

export class UserListComponent implements OnInit {

	@Input()
	users: User[];

    constructor( private authService: AuthService,
				 private router: Router,
				 private errorService: ErrorService 
				 ) {}

    ngOnInit () {
		if (!this.authService.isLoggedIn()) {
			console.log("re-setting user due to logout");
			this.errorService.handleError(
					this.errorService.loginTimeoutError
					);
			this.router.navigate(['/authentication/signin']);
		} else {
			console.log("carry on");
			this.authService.getUsers()
				.subscribe(
					(users: User[]) => {
						// console.log("* * * * getusers * * * *");
						// console.log(users);
						this.users = users;
						// console.log(this.users);
					}
				);
		}

    }
}