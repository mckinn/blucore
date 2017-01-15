import { EventEmitter } from "@angular/core";

import { Error } from "./error.model";



export class ErrorService {

	errorHappened = new EventEmitter<Error>();

	handleError(error: any){
		const errorData = new Error (error.title, error.message);
		this.errorHappened.emit(errorData);
	}

}
