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
	public newUserDoneNotice = { 
		type: "notice",	
		title: "New user creation started.",
		error: { 
			errors: { 
				loginTimeout: {
					name: "watch your email",
					message: "Please watch for an email to complete the process", 
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
					"email": {
						"message": "Error, expected `email` to be unique. Value: `joe@joesgarage.com`",
						"name": "ValidatorError",
						"properties": {
							"type": "unique",
							"message": "Error, expected `{PATH}` to be unique. Value: `{VALUE}`",
							"path": "email",
							"value": "joe@joesgarage.com"
							},
						"kind": "unique",
						"path": "email",
						"value": "joe@joesgarage.com"
						}
					},
					"message": "User validation failed",
					"name": "ValidationError"
				}
			}
*/ 

		if (oops.message) errorMessage = oops.message + "\n";
		if (oops.error) {
			console.log("processing oops :",oops.error);
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

		}
		if (!oops.title) oops.title = "(meta) Error with unknown title";
		const errorData = new Error (oops.title, errorMessage);
		console.log("emitting an error ",errorData);
		this.errorHappened.emit(errorData);
	}

}
