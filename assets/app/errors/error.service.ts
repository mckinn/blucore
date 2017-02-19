import { EventEmitter } from "@angular/core";

import { Error } from "./error.model";



export class ErrorService {

	errorHappened = new EventEmitter<Error>();

	handleError(oops: any){

		// console.log("* * * * handling an error * * * *");
		// console.log(oops);

		var errorMessage: string = "";

		if (oops.error) {
			// console.log(oops.error);
			// console.log("0-> " + errorMessage);
				for (let key in oops.error.errors) {
					if (oops.error.errors.hasOwnProperty(key)) {
						// console.log(key + " -> " + oops.error.errors[key].message);
						errorMessage += (" : " + oops.error.errors[key].path + " - " + oops.error.errors[key].message);
						// console.log("1-> " + errorMessage);
					}
				}
		
			// console.log("2-> ",oops.title, errorMessage);
			const errorData = new Error (oops.title, errorMessage);
			// console.log(errorData);
			this.errorHappened.emit(errorData);
		}
	}

}
