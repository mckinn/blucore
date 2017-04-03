// event.component.ts
import { Component, Input } from "@angular/core";
import { User } from "./user.model";
import { AuthService } from "./auth.service";


@Component ({
	selector: '[app-user]', 
	templateUrl: './user.component.html'
})

export class UserComponent {
	@Input() 
    user: User; 

    constructor(private authService: AuthService){}

	onEdit() {
		this.authService.editUser(this.user);
	}

    /* onDelete() {
        this.eventService.deleteEvent(this.event)
            .subscribe(
                result => // console.log(result)
            );
    } */
	
	isValid() {
		console.log("user valid ???", this.user.valid);
		return (this.user.valid == "approved") // somebody has to be logged on
	};

	showView() {
		return (false) // somebody has to be logged on
	};

	showEdit() {
		return ((localStorage.getItem('userId') != null) // somebody has to be logged on
			// ToDo - remove this once we have some admin users
			&&	(this.authService.whoIsLoggedIn().kind == "admin" )
			)  // and we need to be an admin
	}

}