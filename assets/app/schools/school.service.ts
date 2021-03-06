// event.service.ts
import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";

// import { Router } from "@angular/router";

import "rxjs/Rx";
import { Observable } from "rxjs";

import { School } from "./school.model";
import { CommonHttp } from "../common/common.http";
import { ErrorService } from "../errors/error.service";

import { AppSettings } from '../app.settings';

@Injectable()
export class SchoolService {

	private schoolList: School[] = [];

	constructor(private http: Http, 
				private commonHttp: CommonHttp,
				private errorService: ErrorService
				) {}

	// this is frustrating because we want...
	// a database-driven approach
	// the ability to synchronously retrieve the school list
	// - which means pre-loading.
	// this means checking to see if we have the list, and fetching it if we don't (perhaps?)

	getSchools (parms?:string[]) {
		//
		// in a second iteration we will trust the schools array
		//
		// console.log("in getSchools: ", parms);
		// let parmString: string = "";
		// Note - no parameters supported at this time.
		// if (parms) {
		// 	for (let parmIdx = 0; parmIdx < parms.length; parmIdx++) {
		// 		// console.log("in loop: ", parmIdx, parms[parmIdx]);
		// 		if (parmIdx == 0) parmString = '?' + parms[parmIdx];
		// 		else parmString = '&' + parms[parmIdx];
		// 	}
		// }

		if ( this.schoolList.length != 0) {
			let oSchoolList: Observable<School[]>;
			oSchoolList = Observable.of(this.schoolList);
			console.log("* * * * returning local schools copy: ",oSchoolList);
			return oSchoolList;
		}

		// console.log("parmString: ",parmString);
		const headers = this.commonHttp.setHeaders();
		return this.http.get(AppSettings.API_ENDPOINT + 'schools' // + parmString
							,{headers:headers})
			.map((response:Response) => {
				const schools = response.json().obj;
				// console.log("above school loop" , schools);
				let transformedSchools: School[] = [];
				for (let school of schools) {
					// console.log("top of school loop" ,school);
					const newSchool = new School (
						school.name, 
						school.abbreviation,
						school.adminEmail, 
						school.adminName
					);
					transformedSchools.push(newSchool);
					// console.log("bottom of school loop" ,newSchool, transformedSchools);
				};
				this.schoolList = transformedSchools;
				return transformedSchools; // delivered to the subscribe.
			})
			.catch((error: Response) => {
				console.log("error in getSchools:",error);
				this.errorService.handleError(error.json());
				return Observable.throw(error.json());
			});
		
	}


}