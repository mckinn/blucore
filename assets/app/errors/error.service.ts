import { EventEmitter } from "@angular/core";

import { Error } from "./error.model";



export class ErrorService {

	errorHappened = new EventEmitter<Error>();

	handleError(oops: any){

		console.log(oops);
		console.log(oops.error);

		var errorMessage: string = oops.error.message;
		console.log("0-> " + errorMessage);

		for (let key in oops.error.errors) {
			if (oops.error.errors.hasOwnProperty(key)) {
				console.log(key + " -> " + oops.error.errors[key].message);
				errorMessage += (" : " + oops.error.errors[key].path + " - " + oops.error.errors[key].message);
				console.log("1-> " + errorMessage);
			}
		}
		console.log("2-> " + errorMessage);
		const errorData = new Error (oops.title, errorMessage);
		this.errorHappened.emit(errorData);
	}

}
