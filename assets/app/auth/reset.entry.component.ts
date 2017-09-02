// reset.component.ts

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { AuthService } from './auth.service';
import { User } from './user.model';

@Component ({
	selector: 'app-reset-entry',
	templateUrl: './reset.entry.component.html'
})

export class PasswordResetEntryComponent {
	myForm: FormGroup;

	secret: string;
	uniqueString: string;
	userId: string;

	constructor (private authService: AuthService, 
				 private router: Router,
				 private route: ActivatedRoute) {}

	onSubmit() {
		console.log("resetting password - form", this.myForm.value.password);
		console.log("secret: ",this.secret);
		console.log("userId: ",this.userId);
		console.log("uniqueString: ",this.uniqueString);

		this.authService.passwordReplacement(this.userId,this.secret,this.uniqueString,this.myForm.value.password)
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
			password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
			dupPassword: new FormControl(null, [Validators.required, Validators.minLength(5)])
		});

		console.log("* * * * reset entry * * * *");
		console.log("form: ",this.myForm);
		console.log("snapshot: ",this.route.snapshot);
		// console.log("QParamMap: ",this.route.snapshot.queryParamMap);
		console.log("URL: ",this.route.url);

		this.secret = this.route.snapshot.params['secret'];
		console.log("secret: ",this.secret);
		this.userId = this.route.snapshot.queryParams['userId'];
		console.log("userId: ",this.userId);
		this.uniqueString = this.route.snapshot.queryParams['uniqueString'];
		console.log("uniqueString: ",this.uniqueString);

	}
}