
import { Http, Response, ResponseOptions, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

import "rxjs/Rx";
import { Observable } from "rxjs";

import { User } from './user.model';
import { Event } from '../events/event.model';
import { ErrorService } from '../errors/error.service';

@Injectable()
export class AuthService {

	private users: User[] = [];
	private loggedInUser: User;

	constructor (private http: Http, 
				private errorService: ErrorService, 
				private router: Router,
				private responseOptions: ResponseOptions){}

	addUser(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		// console.log(user);
		// console.log(body);
		return this.http.post('http://localhost:3000/user',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				// console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}

	updateUser(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		console.log("* * * * Update User * * * *",user,body);
		return this.http.patch(
				'http://localhost:3000/user/users/'+user.userId,
				body,
				{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.error(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}
		
	getUsers () {
		return this.http.get('http://localhost:3000/user/users')
			.map((response:Response) => {
				// console.log(response);
				const users = response.json().obj;
				let transformedUsers: User[] = [];
				for (let user of users) {
					transformedUsers.push(new User(user.email, '', user.firstName, user.lastName, user.wcpssId, user.school, user.kind, user._id ));
				}
				this.users = transformedUsers;
				return transformedUsers;
			})
			.catch((error: Response) => {
				console.error(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});	
		};
	// get a user object from a user id.
	getUser (uid: String) {
		// console.log(uid);
		return this.http.get('http://localhost:3000/user/users/'+uid)
			.map((response:Response) => {
				// console.log("in the users get response");
				// console.log(response);
				const user = response.json().obj;
				// console.log(user);
				const userObj = new User(user.email, '', user.firstName, user.lastName, user.wcpssId, user.school, user.kind, user._id, user.events );
				// console.log("* * * * userObj * * * *");
				// console.log(userObj);
				return userObj;
			})
			.catch((error: Response) => {
				console.error(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		
		}
	signin(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		// console.log(user);
		// console.log(body);
		return this.http.post('http://localhost:3000/user/signin',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				// console.log("* * * * signin error handler * * * *");
				console.error(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}

	logout() {
		localStorage.clear();
		}

	// ToDo - does this really belong here ?  
	// It does not really touch the single instance of a user
	editUser (user: User) {
		// prompt the loading of the event
		// console.log("user edit triggered in service");
		// console.log(user,user.userId);
		this.router.navigate(['/authentication/edit',user.userId]);
		}

	isLoggedIn () {
		// console.log("login check ",localStorage.getItem('token'));
		return localStorage.getItem('token') != null;
		}

	whoIsLoggedIn () {
		return this.loggedInUser;
		}

	setWhoIsLoggedIn ( user: User, userId: string) {
		// console.log ("setWhoIsLoggedIn");
		// console.log (user);
		this.loggedInUser = user;
		this.loggedInUser.userId = userId;
		// console.log (this.loggedInUser);
		this.getUser( this.loggedInUser.userId)
			.subscribe(
				data => {
					// console.log("data from getUser");
					// console.log(data);
					if (!this.loggedInUser.firstName) this.loggedInUser.firstName = data.firstName;
					if (!this.loggedInUser.lastName) this.loggedInUser.lastName = data.lastName;
					if (!this.loggedInUser.email) this.loggedInUser.email = data.email;
					if (!this.loggedInUser.school) this.loggedInUser.school = data.school;
					if (!this.loggedInUser.wcpssId) this.loggedInUser.wcpssId = data.wcpssId;
					if (!this.loggedInUser.kind) this.loggedInUser.kind = data.kind;
					if (!this.loggedInUser.userId) this.loggedInUser.userId = data.UserId;
					if (!this.loggedInUser.myEvents) this.loggedInUser.myEvents = data.myEvents;
					// console.log (this.loggedInUser);
					
				}
			);
		// return this.loggedInUser;
		}

	notInMyList(eventId: string) {
		// the eventId is not in my list.
		// replicated in the list and in edit component - need to refactor ToDo
		// console.log("this event... ",eventId);
		const myEvents = this.whoIsLoggedIn().myEvents;
		// console.log("my events... ",myEvents);
		for (let evt of myEvents) {
			// console.log("looking for a previously selected event ", evt);
			if (evt == eventId) {  // one of the events in my list is this event - I have already selected It
				// console.log(false);
				return false;
			}
		}
		// console.log(true);
		return true;
	}

	clearWhoIsLoggedIn () {
		this.loggedInUser = null;
		}

	loggedInRole() {
		return this.loggedInUser.kind;
		}
	claimEvent ( event: Event ) { // add the specified event to the user's list of events.
		
		console.log ("* * * * claimEvent * * * *",event);

		let error: Object;
		
		if ((this.loggedInUser) && (event) && (event.eventId)) {

			// I have to update the user.
			if (this.loggedInUser.myEvents.find(
				function(current: string){
					return ( current == event.eventId )}))	
				{
					error = {
						title:"The event is already there",
						error: {
							errors: [{message:"this is a secondary message"}]
						}
					};
				} else {
					console.log("Adding the selected event: ",this.loggedInUser.myEvents);
					this.loggedInUser.myEvents.push(event.eventId);
					// console.log(this.loggedInUser.myEvents);
					return this.updateUser(this.loggedInUser);
				}
			} else {
				error = {
					title:"User cannot claim event",
					error: {
						errors: [{message:"this is a secondary message"}]
					}
				};
			}
			// console.log("the error I created", error);
			this.errorService.handleError(error);
			return Observable.throw(error);
		};


	}