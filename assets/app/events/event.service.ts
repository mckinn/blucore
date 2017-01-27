// event.service.ts
import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

import "rxjs/Rx";
import { Observable } from "rxjs";

import { Event } from "./event.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class EventService {

	private events: Event[] = [];
	eventEditHappened = new EventEmitter<Event>();

	constructor(private http: Http, private errorService: ErrorService, private router: Router) {}

	addEvent (evt:Event) {
		console.log("* * * * add event * * * *");
		console.log(evt);
		delete evt.ownerName;  // get rid of derived items
		delete evt.eventId;
		const body = JSON.stringify(evt);
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
				console.log(result);
				const evt = new Event (
						result.obj.name, 
						result.obj.description,
						result.obj.date,
						0,   // eventNumber - we'sort this out later.
						result.obj._id, // the internal ID - named the eventId.
						result.obj.time, 
						result.obj.duration,
						result.obj.school,
						result.obj.ownerId.firstName + " " + result.obj.ownerId.lastName,
						result.obj.ownerId._id
					);
				this.events.push(evt);
				return evt;
			})
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}

	getEvent (eventId : string) {
		console.log("* * * * in getevent - eventId= * * * *");
		console.log(eventId);
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		return this.http.get('http://localhost:3000/event/'+eventId + token)
			.map((response:Response) => {
				const evt = response.json().obj;
				console.log(evt);
				const newEvt = new Event (
					evt.name, 
					evt.description,
					evt.date, 
					evt.eventNumber,
					evt._id, // named the eventId
					evt.time,
					evt.duration,
					evt.school,
					evt.ownerId.firstName + " " + evt.ownerId.lastName,
					evt.ownerId._id
				);
				console.log(newEvt);
				return newEvt;
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
				for (let evt of events) {
					console.log(evt);
					const newEvt = new Event (
						evt.name, 
						evt.description,
						evt.date, 
						evt.eventNumber,
						evt._id, 
						evt.time,
						evt.duration,
						evt.school,
						evt.ownerId.firstName + " " + evt.ownerId.lastName,
						evt.ownerId._id
					);
					console.log(newEvt);
					transformedEvents.push(newEvt);
				};
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
		console.log("edit triggered in service");
		this.router.navigate(['/events/input',event.eventId]);
		this.eventEditHappened.emit(event);
	}

	updateEvent (evt: Event) {
		// update the server.
		const tempEventId: string = evt.eventId;
		console.log(evt);
		delete evt.ownerName;
		delete evt.eventId;
		console.log(evt);
		const body = JSON.stringify(evt);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		// creates an observable and returns it
		console.log("* * * * in updateEvent * * * *");
		console.log(event);
		return this.http.patch( 'http://localhost:3000/event/'+ tempEventId + token, body, {headers: headers})
			// this is an anonymous function that takes a Response and yields a response.json ????
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}

	deleteEvent (evt:Event) {

		this.events.splice(this.events.indexOf(evt), 1);
		// update the server.
		// creates an observable and returns it
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		return this.http.delete( 'http://localhost:3000/event/'+ evt.eventId + token)
			// this is an anonymous function that takes a Response and yields a response.json ????
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			});
	}
}