// event.component.ts
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

import { Event } from "./event.model";
import { User } from "../auth/user.model";
import { EventService } from "./event.service";
import { AuthService } from "../auth/auth.service";

@Component ({
	selector: '[app-event]', 
	templateUrl: './event.component.html',
	styles: [`
    	.config {
    		display: inline-block;
    		text-align: right;
    		font-size: 12px;
    		width: 19%;
    	}
    `]

})

export class EventComponent {
	
	@Input() event: Event; 

    constructor(private eventService: EventService, 
			private authService: AuthService,
			private router: Router){}

	onEdit() {
		this.eventService.editEvent(this.event);
	}

    onDelete() {
		// console.log("Deletion attempt");
        this.eventService.deleteEvent(this.event);
    }

	onSelect() {
		this.authService.claimEvent(this.event); // it handles its own errors.
    }

	 onDecline() {
        this.authService.declineEvent(this.event);
    }

	onShowTeacher(){
		this.router.navigate(['/events/edit',this.event.ownerId]);
	}
	
	eventIsNotMine() {
		return ((localStorage.getItem('userId') != this.event.ownerId) &&
				(localStorage.getItem('userId') != null)
		) // somebody ELSE has to be logged on
	}

	iHaveNotSelectedThis() {
		// the eventId is not in my list.
		// replicated in the list and in edit component - need to refactor ToDo
		return this.authService.notInMyList(this.event.eventId);
	}


	showEdit() {
		return ((localStorage.getItem('userId') == this.event.ownerId) // It must be mine and I must be allowed to edit
			&&	( (this.authService.whoIsLoggedIn().kind == "admin") ||  
				(this.authService.whoIsLoggedIn().kind == "teacher") ))
	}


	iAmAStudent() {
		// // console.log("* * * * I am a teacher * * * *",this.authService.whoIsLoggedIn().kind);
		return (this.authService.whoIsLoggedIn().kind == 'student');
	}

}
