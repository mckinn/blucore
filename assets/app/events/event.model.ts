// the model of a event, used as a class/type definition.

export class Event {
	content: string;
	username: string;
	eventId?: string;
	userId?: string;

	constructor(content:string, username:string, eventId?:string, userId?:string) {
		this.content = content;
		this.username = username;
		this.eventId = eventId;
		this.userId = userId;
	} 
}