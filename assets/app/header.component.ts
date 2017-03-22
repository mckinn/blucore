// header.component.ts

import { Component } from "@angular/core";
import { AuthService } from "./auth/auth.service";

@Component ({
	selector: 'app-header',
	templateUrl: './header.component.html'
})

export class HeaderComponent {

	headerimg: string;
	studentimg: string;
	teacherimg: string;
	adminimg: string;

	constructor ( private authService: AuthService){
		this.headerimg = '/images/header.png';
		this.studentimg = '/images/student.png'
		this.teacherimg = '/images/teacher.png'
		this.adminimg = '/images/administrator.png'
	}

	whoIsLoggedIn (){
		// // console.log("in whoIsLoggedIn");
		if (this.authService.isLoggedIn()) {
			// // console.log("user email");
			// // console.log(this.authService.whoIsLoggedIn().email);
			return this.authService.whoIsLoggedIn().email + " - " +
					this.authService.whoIsLoggedIn().kind;
		} 
		return "";
	}
	
}