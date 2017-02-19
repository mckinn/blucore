
export class Email { 
	// typescript provides the short form that results 
	// from declaring the data elements in the constructor as 'public'
	constructor (
		public to: string,
		public from: string,
        public subject:string,
		public body: string
		) {}
}