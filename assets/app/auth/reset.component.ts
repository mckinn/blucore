// reset.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from './user.model';

@Component ({
	selector: 'app-reset',
	templateUrl: './reset.component.html'
})

export class PasswordResetComponent {
	myForm: FormGroup;

	constructor (private authService: AuthService, 
				 private router: Router) {}

	onSubmit() {
		console.log("resetting password - form", this.myForm);
		const user = new User(this.myForm.value.email, "");
		console.log("resetting password - user",user);
		this.authService.passwordReset(user)
			.subscribe(
				data => {
					console.log("* * * * password reset * * * ", data);
				},
				error => {
					console.log("* * * * bad password error * * * ", error);
					console.error(error);
				}
			);

		this.myForm.reset();
	}

	ngOnInit() {
		// console.log("password reset component");
		this.myForm = new FormGroup({
			email: new FormControl(null, [
					Validators.required, 
					Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
					])
		});
	}
}