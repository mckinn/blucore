
import { Http, Response, ResponseOptions, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import "rxjs/Rx";
import { Observable } from "rxjs";

import { User } from './user.model';
import { Event } from '../events/event.model';
import { ErrorService } from '../errors/error.service';
import { EventService } from '../events/event.service';
import { AppSettings } from '../app.settings';
import { CommonHttp } from '../common/common.http';

@Injectable()
export class AuthService {

	private users: User[] = [];
	private editingUser: User;
	private loggedInUser: User;

	constructor (private http: Http, 
				private errorService: ErrorService, 
				private router: Router,
				private responseOptions: ResponseOptions, 
				private eventService: EventService,
				private commonHttp: CommonHttp
				){}

	addUser(user: User) {
		const body = JSON.stringify(user);
		const headers = this.commonHttp.setHeaders();
		// const headers = new Headers({'Content-Type': 'application/json'});
		console.log("in addUser: user=",user);
		console.log("in addUser: body=",body);
		return this.http.post(AppSettings.API_ENDPOINT + 'user',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				// console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}

	updateUser(user: User) {
		console.log("Updating user: ", user);
		const body = JSON.stringify(user);
		console.log("message body: ", body);
		// const headers = new Headers({'Content-Type': 'application/json'});
		const headers = this.commonHttp.setHeaders();
		console.log("* * * * Update User * * * *",user,body);
		return this.http.patch(
				AppSettings.API_ENDPOINT + 'user/users/'+user.userId,
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
		const headers = this.commonHttp.setHeaders();
		return this.http.get(AppSettings.API_ENDPOINT + 'user/users',{headers:headers})
			.map((response:Response) => {
				// console.log(response);
				const users = response.json().obj;
				let transformedUsers: User[] = [];
				for (let user of users) {
					transformedUsers.push(new User( user.email, '', user.firstName, user.lastName, user.emailValid, user.school,
													user.kind, user._id, user.userName, user.events, user.attendedEvents, user.valid, user.phone ));
				}
				this.users = transformedUsers;
				return transformedUsers;
			})
			.catch((error: Response) => {
				console.error("caught error is: ",error);
				console.error("caught error in json is: ",error.json());
				console.error("caught sstatus is: ",error.status);
				this.errorService.handleError(error.json(),error.status);
				return Observable.throw(error.json());
			});	
		};

	// get a user object from a user id.
	getUser (uid: String) {
		// console.log("in getUser: ",uid);
		// const headers = new Headers({'Content-Type': 'application/json','X-token':'this is a token'});
		const headers = this.commonHttp.setHeaders();
		return this.http.get(AppSettings.API_ENDPOINT + 'user/users/'+uid,{headers:headers})
			.map((response:Response) => {
				// console.log("in the users get response");
				// console.log(response);
				const user = response.json().obj;
				// console.log(user);
				const userObj = new User(user.email, '', user.firstName, user.lastName, user.emailValid, 
										user.school, user.kind, user._id, user.userName, user.events, user.attendedEvents,
										user.valid, user.phone );
				// console.log("* * * * userObj * * * *");
				// console.log(userObj);
				// fix broken user validation values
				if ((userObj.valid != "rejected") && (userObj.valid != "approved") ) userObj.valid = "unknown";
				return userObj;
			})
			.catch((error: Response) => {
				console.error(error);
				// console.log("clearing out the token and userId");
				localStorage.removeItem('token');
				localStorage.removeItem('userId');
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}

	signin(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		console.log(user);
		console.log(body);
		console.log(AppSettings.API_ENDPOINT);
		return this.http.post(AppSettings.API_ENDPOINT + 'user/signin',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				// console.log("* * * * signin error handler * * * *");
				console.error(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}

	passwordReset(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		// console.log(user);
		// console.log(body);
		return this.http.post(AppSettings.API_ENDPOINT + 'user/reset',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log("* * * * password reset error handler * * * *", error);
				console.error(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		}

	passwordReplacement(userId: string, secret: string, uniqueString: string, password: string) {
		// hit the password replacement url

		const body = JSON.stringify(
			{
				"userId": userId,
				"secret": secret,
				"uniqueString" : uniqueString,
				"password": password
			}
		);
		const headers = new Headers({'Content-Type': 'application/json'});
		console.log(body);
		return this.http.post(AppSettings.API_ENDPOINT + 'user/replacepassword',body,{headers: headers})
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log("* * * * password replacement error handler * * * *", error);
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
		// console.log("editUser - user edit triggered in service",user,user.userId);
		this.router.navigate(['/events/edit',user.userId]);
		}

	isLoggedIn () {
		// console.log("login check ",localStorage.getItem('token'));
		return localStorage.getItem('token') != null;
		}

	whoIsLoggedIn () {
		return this.loggedInUser;
		}

	setWhoIsLoggedIn ( user: User, userId: string) {
		// console.log ("setWhoIsLoggedIn", user);
		this.loggedInUser = user;
		this.loggedInUser.userId = userId;
		// console.log ("in setWhoIsLoggedIn: ",this.loggedInUser);
		this.getUser( this.loggedInUser.userId)
			.subscribe(
				data => {
					// console.log("data from getUser: ",data);
					// console.log("current loggedinuser: ",this.loggedInUser);
					if (!this.loggedInUser.firstName) this.loggedInUser.firstName = data.firstName;
					if (!this.loggedInUser.lastName) this.loggedInUser.lastName = data.lastName;
					if (!this.loggedInUser.email) this.loggedInUser.email = data.email;
					if (!this.loggedInUser.school) this.loggedInUser.school = data.school;
					this.loggedInUser.emailValid = data.emailValid;
					if (!this.loggedInUser.kind) this.loggedInUser.kind = data.kind;
					if (!this.loggedInUser.userName) this.loggedInUser.userName = data.UserName;
					if (!this.loggedInUser.userId) this.loggedInUser.userId = data.UserId;
					if (!this.loggedInUser.myEvents) this.loggedInUser.myEvents = data.myEvents;
					if (!this.loggedInUser.attendedEvents) this.loggedInUser.attendedEvents = data.attendedEvents;
					if (!this.loggedInUser.valid) this.loggedInUser.valid = data.valid;
					if (!this.loggedInUser.phone) this.loggedInUser.phone = data.phone;
					// console.log (this.loggedInUser);
					
				}
			);
		// return this.loggedInUser;
		}

	setNamedUser (user: User) {
		this.editingUser = user;
	}

	getNamedUser () {
		return this.editingUser;
	}

	notInMyPlannedList(eventId: string) {
		// the eventId is not in my list.
		// replicated in the list and in edit component - need to refactor ToDo
		const myEvents = this.whoIsLoggedIn().myEvents;
		for (let evt of myEvents) {
			if (evt == eventId) {  // one of the events in my list is this event - I have already selected It
				return false;
			}
		}
		return true;
	}

	notInMyAttendedList(eventId: string) {
		// the eventId is not in my list.
		// replicated in the list and in edit component - need to refactor ToDo
		// console.log("WHO:  ",this.whoIsLoggedIn());
		const doneEvents = this.whoIsLoggedIn().attendedEvents;
		// console.log("doneEvents: ",doneEvents);
		for (let evt of doneEvents) {
			if (evt == eventId) {  // one of the events in my list is this event - I have already selected It
				return false;
			}
		}
		return true;
	}

	clearWhoIsLoggedIn () {
		this.loggedInUser = null;
		}

	loggedInRole() {
		return this.loggedInUser.kind;
	}
	
	claimEvent ( event: Event ) { // add the specified event to the user's list of events.
		
		// console.log ("* * * * claimEvent * * * *",event, this.loggedInUser);

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
				} else { //event is not (yet) associated with the user
					// console.log("******************** Claiming the selected event: ",this.loggedInUser.myEvents);
					this.loggedInUser.myEvents.push(event.eventId);
					// console.log("User with events", this.loggedInUser.myEvents);
					if (event.participants.length >= event.participantCount) {
						// we should have caught this in the UI
						error = {
							title:"This event is full",
							error: {
								errors: [{message:"The event can only have "+event.participantCount+" attendees"}]
							}
						}
					} else {
						event.participants.push( this.loggedInUser.userId );
						// update the event, and the user, on the server to preserve the linkages
						Observable.forkJoin([this.eventService.updateEvent(event),this.updateUser(this.loggedInUser)])
							.subscribe(results => {
								// console.log("results are...",results[0],results[1]);
							});
						// console.log("event and user should be linked: ", event, this.loggedInUser);
						return;
					};	
				}
			} else {
				error = {
					title:"User cannot claim event",
					error: {
						errors: [{message:"something else is wrong"}]
					}
				};
			}
			// console.log("the error I created", error);
			this.errorService.handleError(error);
			return Observable.throw(error);
		};

	declineEvent ( event: Event ) { // remove the specified event from the user's list of events, and the user from the event's particpant list.
		
		// console.log ("* * * * declineEvent * * * *",event);

		let error: Object;
		
		if ((this.loggedInUser) && (event) && (event.eventId)) {

			if (!this.loggedInUser.myEvents.find(
				function(current: string){
					return ( current == event.eventId )}))
				{
					error = {
						title:"Event Missing",
						error: {
							errors: [{message:"The Event is not in the queue for the user."}]
						}
					};
				} else {
					// console.log("******************** disconnect the selected event: ",this.loggedInUser.myEvents);

					// taking away the event from the user's list of events
					// console.log("User Events before removal", this.loggedInUser.myEvents);
					this.loggedInUser.myEvents.splice(this.loggedInUser.myEvents.indexOf(event.eventId),1);
					// console.log("User Events after removal", this.loggedInUser.myEvents);

					// taking away the user from the event's list of participants
					// console.log("Event before User removal",event);

					let participantIndex: number = event.participants.indexOf(this.loggedInUser.userId);
					event.participants.splice(participantIndex,1);

					// console.log("Event after User removal",event);
					// console.log("event and user should not be linked: ", event, this.loggedInUser);
					// update the event, and the user, on the server to preserve the linkages
					Observable.forkJoin([this.eventService.updateEvent(event),this.updateUser(this.loggedInUser)])
						.subscribe(results => {
							// console.log("results are...",results[0],results[1]);
						});
					return;
				}
			} else {
				error = {
					title:"User cannot decline event",
					error: {
						errors: [{message:"this is a secondary message"}]
					}
				};
			}
			this.errorService.handleError(error);
			return Observable.throw(error);
		};

	toggleEventOpenClosed ( event: Event, closeIt: boolean ) { 
		// move the event to the user's attended list from the myEvents list (pretending to close it)
		// or visa-versa based on the closeIt value

		console.log ("* * * * toggleEvent * * * *",this.loggedInUser ,closeIt, event);

		let error: Object;
		
		if ((this.loggedInUser) && (event) && (event.eventId)) {
				if (closeIt) {
					// take from myEvents and put into attendedEvents
					let where = this.loggedInUser.myEvents.indexOf(event.eventId);
					console.log("from myEvents to attended: ", this.loggedInUser,where);
					if ( this.loggedInUser.myEvents.includes(event.eventId)) {
						console.log("Removing ", event.eventId, " from ", this.loggedInUser.myEvents, " at ", where );
						this.loggedInUser.myEvents.splice(where,1);
					}
					if (!this.loggedInUser.attendedEvents.includes(event.eventId)) this.loggedInUser.attendedEvents.push(event.eventId);
				} else {
					// take from attendedEvents and put into myEvents
					let where = this.loggedInUser.attendedEvents.indexOf(event.eventId);
					console.log("from attented to myEvents: ", this.loggedInUser,where);
					if ( this.loggedInUser.attendedEvents.includes(event.eventId)) {
						console.log("Removing ", event.eventId, " from ", this.loggedInUser.attendedEvents, " at ", where );
						this.loggedInUser.attendedEvents.splice(where,1);
					}
					if (!this.loggedInUser.myEvents.includes(event.eventId)) this.loggedInUser.myEvents.push(event.eventId);
				}
				console.log("after the swap ", this.loggedInUser);
				this.updateUser(this.loggedInUser)
					.subscribe(results => {
						console.log("User update results are...",results);
						// whatever this.loggedInUser is like should get written to that user, and they should be in sync again.
					});
				return;
			} else {
				error = {
					title:"Error in switching closed status",
					error: {
						errors: [{message:"please log a bug to the right.  Please include your email address so that I can get details."}]
					}
				};
			}
			this.errorService.handleError(error);
			return Observable.throw(error);
		};

}