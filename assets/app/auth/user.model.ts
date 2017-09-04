
// import { Event } from '../events/event.model';

export class User { 
	// typescript provides the short form that results 
	// from declaring the data elements in the constructor as 'public'
	constructor (
		public email:string,
		public password: string,
		public firstName?: string,   // the ? makes the fields optional
		public lastName?: string,
		public emailValid?: Boolean,
		public school?: string,  // wcpss student or teacher ID
		public kind?: string, // Admin, Student, Teacher, Parent
		public userId?: string,
		public userName?: string, // the aggregate user name
		public myEvents?: string[],
		public attendedEvents?: string[],
		public valid?: string, // approved, rejected, unknown
		public phone?: string
		) {}


}