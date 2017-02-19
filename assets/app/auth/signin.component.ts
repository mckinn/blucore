// signin.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from './user.model';

@Component ({
	selector: 'app-signin',
	templateUrl: './signin.component.html'
})

export class SignInComponent {
	myForm: FormGroup;

	constructor (private authService: AuthService, private router: Router) {}

	onSubmit() {
		// console.log(this.myForm);
		const user = new User(this.myForm.value.email, this.myForm.value.password);
		// console.log(user);
		this.authService.signin(user)
			.subscribe(
				data => {
					localStorage.setItem('token',data.token);
					localStorage.setItem('userId',data.userId);
					this.authService.setWhoIsLoggedIn(user, data.userId);
					this.router.navigateByUrl('/');
				},
				error => {
					// console.log("* * * * bad password error * * * ");
					console.error(error);
				}
			);

		this.myForm.reset();
	}

	ngOnInit() {
		this.myForm = new FormGroup({
			email: new FormControl(null, [
					Validators.required, 
					Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
					]),
			password: new FormControl(null, Validators.required)
		});
	}
}