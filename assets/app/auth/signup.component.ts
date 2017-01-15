// signup.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "./auth.service";

import { User } from "./user.model";

@Component ({
	selector: 'app-signup',
	templateUrl: './signup.component.html'
})

export class SignUpComponent implements OnInit {
	myForm: FormGroup;

	constructor( private authService: AuthService ) {}

	onSubmit() {
		console.log(this.myForm);
		const user = new User(
			this.myForm.value.email, 
			this.myForm.value.password, 
			this.myForm.value.firstName, 
			this.myForm.value.lastName,
			this.myForm.value.wcpssId,
			this.myForm.value.school 
		);
		console.log(user);
		
		this.authService.signup( user )
			.subscribe(
				data => console.log(data),
				error => console.error(error)
			);
		this.myForm.reset();
		
	}

	ngOnInit() {
		this.myForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			email: new FormControl(null, [
					Validators.required, 
					Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
					]),
			password: new FormControl(null, Validators.required),
			wcpssId: new FormControl(null, Validators.required),
			school: new FormControl(null, Validators.required)
		});
	}

}