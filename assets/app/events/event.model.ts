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
	roomNumber?: string;
	participantCount?: number;
	ownerName?: string;
	ownerId?: string;
	participants?: string[];



	constructor(name:string, description: string, date:string, eventNumber: number, eventId: string,
				time?:string, duration?:number, school?: string, roomNumber?: string, participantCount?: number,
				ownerName?:string, ownerId?:string,  participants?: string[]) 
	{
		this.name = name;
		this.description = description;
		this.date = date;
		this.eventNumber = eventNumber;
		this.eventId = eventId;  // the database ID of the event
		this.time = time;
		this.duration = duration;
		this.school = school;
		this.roomNumber = roomNumber;
		this.participantCount = participantCount;
		this.ownerName = ownerName;
		this.ownerId = ownerId;
		this.participants = participants;
	} ;
}