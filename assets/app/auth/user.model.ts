// user.model.ts
export class User { 
	// typescript provides the short form that results 
	// from declaring the data elements in the constructor as 'public'
	constructor (
		public email:string,
		public password: string,
		public firstName?: string,   // the ? makes the fields optional
		public lastName?: string,
		public wcpssId?: string,
		public school?: string,  // wcpss student or teacher ID
		public kind?: string // A, S, T, P, null
		) {}
}