import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Http, Response, ResponseOptions, Headers } from "@angular/http";

import { AppSettings } from '../app.settings';
import { AuthService } from "../auth/auth.service";
import { Email } from './email.model';
import { CommonHttp } from '../common/common.http';

@Component ({
	selector: 'app-email',
	templateUrl: './email.compose.component.html',
	styles: [`
		.backdrop {
			background-color: rgba(0,100,100,0.6);
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100vh
		}
	`]
})

export class EmailComponent implements OnInit {

	constructor ( 	private router: Router,
					private authService: AuthService,
					private http: Http,
					private commonHttp: CommonHttp,
					private location:Location 
				) {};

	email: Email;

	destination: string;
    display: string;

	emailForm: FormGroup;

	submitEmail() {
		this.display = 'none';
		let fromUser = this.authService.whoIsLoggedIn();
		let toUser = this.authService.getNamedUser();
		this.email = new Email (
			// ignore the real target until we go live.
			// this.authService.getNamedUser().email, // todo 
			this.destination,  // toUser.email once we are up and running
			fromUser.email, //from
			toUser.firstName + ' ' + toUser.lastName, // to common
			fromUser.firstName + ' ' + fromUser.lastName,// from common
			this.emailForm.value.emailSubject,
			"interpersonal",   // the name of the template to use.
			this.emailForm.value.emailBody
			);
        console.log("send the email here", this.email);
		const body = JSON.stringify(this.email);
		const headers = this.commonHttp.setHeaders();
		// fire and forget for now.
		// ToDo - add a copy myself on the email capability.
		this.http.post( AppSettings.API_ENDPOINT + 'email',	body, {headers: headers})
			.subscribe();
		this.location.back();
		// this.router.navigate(['/events']);
	}

	cancelEmail() {
		this.display = 'none';
        console.log("cancel the email here", this.email );
		this.location.back();
		// this.router.navigate(['/events']);
	}


	ngOnInit() {
		console.log("in email component");
        this.display = 'block';
		this.destination = 'mckinn@gmail.com';
		this.emailForm = new FormGroup({
				emailSubject: new FormControl(null, Validators.required),
				emailBody: new FormControl(null, Validators.required)
		});

	}


}