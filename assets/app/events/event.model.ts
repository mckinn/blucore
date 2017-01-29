// the UI model of a event, used as a class/type definition.

export class Event {
	name: string;
	description: string;
	date: string; // apply a regex
	eventNumber: number;  // events do need a unique id.  This is not the database id
	eventId: string; // this is the database unique ID.
	time?: string;
	duration?: number; // minutes
	school?: string;
	kind?: string;
	ownerName?: string;
	ownerId?: string;



	constructor(name:string, description: string, date:string, eventNumber: number, eventId: string, time?:string, duration?:number, 
				school?: string, kind?: string, ownerName?:string, ownerId?:string) 
	{
		this.name = name;
		this.description = description;
		this.date = date;
		this.eventNumber = eventNumber;
		this.eventId = eventId;  // the database ID of the event
		this.time = time;
		this.duration = duration;
		this.school = school;
		this.kind = kind;
		this.ownerName = ownerName;
		this.ownerId = ownerId;
	} ;
}