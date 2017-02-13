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

	constructor(private http: Http, private errorService: ErrorService, private router: Router) {}

	addEvent (evt:Event) {
		console.log("* * * * add event * * * *");
		console.log(evt);
		// delete evt.ownerName;  // get rid of derived items
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
		console.log("* * * * in getevent - eventId= * * * *", eventId);
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		return this.http.get('http://localhost:3000/event/'+eventId + token)
			.map((response:Response) => {
				const evt = response.json().obj;
				console.log("event in getEvent: ",evt);
				const newEvt = new Event (
					evt.name, 
					evt.description,
					evt.date, 
					evt.eventNumber,
					evt._id, // named the eventId
					evt.time,
					evt.duration,
					evt.school,
					evt.kind,
					evt.ownerId.firstName + " " + evt.ownerId.lastName,
					evt.ownerId._id,
					evt.participants
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
						evt.kind,
						evt.ownerId.firstName + " " + evt.ownerId.lastName,
						evt.ownerId._id,
						evt.participants
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
	}

	updateEvent (evt: Event) {
		// update the server.
		const tempEventId: string = evt.eventId;
		console.log("Updating Event: ",evt);
		// delete evt.ownerName;
		delete evt.eventId;
		console.log(evt);
		const body = JSON.stringify(evt);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		// creates an observable and returns it
		console.log("* * * * in updateEvent - sending patch * * * *",tempEventId,body);
		const url = 'http://localhost:3000/event/'+ tempEventId + token;
		console.log(url);
		return this.http.patch( url, body, {headers: headers})
			// this is an anonymous function that takes a Response and yields a response.json ????
			.map((response: Response) => response.json())
			.catch((error: Response) => {
				console.log("Patch Error Response: ",error);
				this.errorService.handleError(error.json());
				return Observable.throw(error.json());
			});
	}

	deleteEvent (evt:Event) {

		console.log("in delete event: ",evt, this.events);
		// todo - there is an issue in that the event that I am attempting to 
		// delete is not in the list of events.
		// I believe that this is because I created a new list out of the
		// users list.  I have to find the list with the same ID and delete it.
		let indexOfEvent = this.events.indexOf(evt);
		console.log("index: ",indexOfEvent);
		if (indexOfEvent < 0) {
			for (let i=0; i<this.events.length;i++){
				console.log("scanning:", i, this.events[i]);
				if (evt.ownerId == this.events[i].ownerId) {
					console.log("found it: ", this.events[i] );
					indexOfEvent = i;
				}
			}
		}
		console.log("before splice attempt", this.events);
		this.events.splice(indexOfEvent, 1);
		console.log("after splice attempt", this.events);
		// update the server.
		// creates an observable and returns it
		const token = localStorage.getItem('token') 
			? '?token='+ localStorage.getItem('token') 
			: '';
		console.log("just before DELETE call to /event/"+ evt.eventId + token);

		return this.http.delete( 'http://localhost:3000/event/'+ evt.eventId + token )

			// this is an anonymous function that takes a Response and yields a response.json ????
			
			.map((response: Response) => {
				console.log("In the response: ",response);
				response.json()
			})
			.catch((error: Response) => {
				console.log(error);
				this.errorService.handleError(error.json())
				return Observable.throw(error.json());
			})
			.subscribe((res)=> {});
			
	}
}