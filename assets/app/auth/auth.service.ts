
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";

import "rxjs/Rx";
import { Observable } from "rxjs";

import { User } from './user.model';
import { ErrorService } from '../errors/error.service';

@Injectable()
export class AuthService {

	private users: User[] = [];
	constructor (private http: Http, private errorService: ErrorService){}

	signup(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		console.log(user);
		console.log(body);
		return this.http.post('http://localhost:3000/user',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}

	signin(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		console.log(user);
		console.log(body);
		return this.http.post('http://localhost:3000/user/signin',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}

	logout() {
		localStorage.clear();
	}

	isLoggedIn () {
		return localStorage.getItem('token') !== null;
	}

	getUsers () {

		return this.http.get('http://localhost:3000/user/userlist')
			.map((response:Response) => {
				console.log(response);
				const users = response.json().obj;
				let transformedUsers: User[] = [];
				for (let user of users) {
					transformedUsers.push(new User(user.email, '', user.firstName, user.lastName, user.wcpssId, user.school ));
				}
				this.users = transformedUsers;
				return transformedUsers;
			})
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		
	}
}