import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Http, Response, ResponseOptions, Headers } from "@angular/http";

import { AppSettings } from '../app.settings';
import { AuthService } from "../auth/auth.service";
import { Email } from './email.model';

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
				) {};

	email: Email;

	destination: string;
    display: string;

	emailForm: FormGroup;

	submitEmail() {
		this.display = 'none';
		this.email = new Email (
			// ignore the real target until we go live.
			// this.authService.getNamedUser().email, //to
			this.destination,
			this.authService.whoIsLoggedIn().email, //from
			this.emailForm.value.emailSubject,
			this.emailForm.value.emailBody
			);
        console.log("send the email here", this.email);
		const body = JSON.stringify(this.email);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		// fire and forget for now.
		// ToDo - add a copy myself on the email capability.
		this.http.post( AppSettings.API_ENDPOINT + 'email'+token,	body, {headers: headers})
			.subscribe();
		this.router.navigate(['/events']);
	}

	cancelEmail() {
		this.display = 'none';
        console.log("cancel the email here", this.email );
		this.router.navigate(['/events']);
	}


	ngOnInit() {
        this.display = 'block';
		this.destination = 'mckinn@gmail.com';
		this.emailForm = new FormGroup({
				emailSubject: new FormControl(null, Validators.required),
				emailBody: new FormControl(null, Validators.required)
		});

	}


}