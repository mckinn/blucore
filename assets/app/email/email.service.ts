import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { CommonHttp } from '../common/common.http';

import { AppSettings } from '../app.settings';
import { User }  from "../auth/user.model";
import { Email } from "./email.model";


@Injectable()
export class emailService {

    destination: string = "mckinn@gmail.com";
    email: Email ; 

	constructor ( 	private http: Http,
					private commonHttp: CommonHttp,
				) {};

	sendEmail(fromUser :User, toUser: User, subject: string, templateName: string, body: string) {

		this.email = new Email (
			// ignore the real target until we go live.
			// this.authService.getNamedUser().email, // todo 
			this.destination,  // toUser.email once we are up and running
			fromUser.email,    //from
			toUser.firstName + ' ' + toUser.lastName, // to common
			fromUser.firstName + ' ' + fromUser.lastName,// from common
			subject, // subject
			templateName,   // the name of the template to use.
			body
			);
        console.log("send the email here", this.email);
		const requestBody = JSON.stringify(this.email);
		const headers = this.commonHttp.setHeaders();
		// fire and forget for now.
		// ToDo - add a copy myself on the email capability.
		this.http.post( AppSettings.API_ENDPOINT + 'email',	requestBody, {headers: headers})
			.subscribe();

	}

}