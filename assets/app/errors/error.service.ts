import { EventEmitter } from "@angular/core";

import { Error } from "./error.model";



export class ErrorService {

	errorHappened = new EventEmitter<Error>();

	public loginTimeoutError = { 	
					title: "User Login Timeout",
					error: { 
						errors: { 
							loginTimeout: {
								name: "Login Timeout",
								message: "You have been logged out due to inactivity", 
					}	}	}	
				};

	handleError(oops: any, status?: Number ){

		console.log("* * * * handling an error * * * *");
		console.log(oops);

		var errorMessage: string = "";

/*		{
			"title": "An Error Occurred",
			"error": {
				"errors": {
					"wcpssId": {
						"message": "Error, expected `wcpssId` to be unique. Value: `11111`",
						"name": "ValidatorError",
						"properties": {
							"type": "unique",
							"message": "Error, expected `{PATH}` to be unique. Value: `{VALUE}`",
							"path": "wcpssId",
							"value": "11111"
							},
						"kind": "unique",
						"path": "wcpssId",
						"value": "11111"
						}
					},
					"message": "User validation failed",
					"name": "ValidationError"
				}
			}
*/ 

		if (oops.message) errorMessage = oops.message + "\n";
		if (oops.error) {
			// console.log(oops.error);
			// console.log("0-> " + errorMessage);
				for (let key in oops.error.errors) {
					if (oops.error.errors.hasOwnProperty(key)) {
						// console.log(key + " -> " + oops.error.errors[key].message);
						errorMessage += (" : " 
							// + oops.error.errors[key].path + " - " 
							+ oops.error.errors[key].message);
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
