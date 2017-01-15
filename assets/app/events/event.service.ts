// event.service.ts
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";

import "rxjs/Rx";
import { Observable } from "rxjs";

import { Event } from "./event.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class EventService {

	private events: Event[] = [];
	eventEditHappened = new EventEmitter<Event>();

	constructor(private http: Http, private errorService: ErrorService) {}

	addEvent (msg:Event) {
	
		const body = JSON.stringify(msg);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		// creates an observable and returns it
		return this.http.post( 'http://localhost:3000/event'+token,	body, {headers: headers})
			// this is an anonymous function that takes a Response and yields a response.json ????
			// extract the complete response and save that returned result, so that we get the ID 
			// of the just added event
			.map((response: Response) => {
				const result = response.json();
				// const msg = new Event (result.obj.content, 'dummy', result.obj._id, null);
				const msg = new Event (
						result.obj.content, 
						result.obj.user.firstName, 
						result.obj._id, 
						result.obj.user._id
					);
				this.events.push(msg);
				return msg;
			})
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}

	getEvents () {

		return this.http.get('http://localhost:3000/event')
			.map((response:Response) => {
				const events = response.json().obj;
				let transformedEvents: Event[] = [];
				for (let msg of events) {
					transformedEvents.push(new Event(msg.content, msg.user.firstName, msg._id, msg.user._id));
				}
				this.events = transformedEvents;
				return transformedEvents;
			})
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
		
	}

	editEvent (event: Event) {
		// prompt the loading of the event
		this.eventEditHappened.emit(event);
	}

	updateEvent (msg: Event) {
		// update the server.
		const body = JSON.stringify(msg);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		// creates an observable and returns it
		return this.http.patch( 'http://localhost:3000/event/'+ msg.eventId + token, body, {headers: headers})
			// this is an anonymous function that takes a Response and yields a response.json ????
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}

	deleteEvent (msg:Event) {

		this.events.splice(this.events.indexOf(msg), 1);
		// update the server.
		// creates an observable and returns it
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		return this.http.delete( 'http://localhost:3000/event/'+ msg.eventId + token)
			// this is an anonymous function that takes a Response and yields a response.json ????
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}
}