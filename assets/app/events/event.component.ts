// event.component.ts
import { Component, Input, OnInit } from "@angular/core";
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

export class EventComponent implements OnInit {
	
	@Input() rowevent: Event;
	@Input() attended: boolean;  // are we displaying the attended or the planned list ?

    constructor(private eventService: EventService, 
				private authService: AuthService,
				private router: Router){}

	onEdit() {
		this.eventService.editEvent(this.rowevent);
	}

    onDelete() {
		// console.log("Deletion attempt");
        this.eventService.deleteEvent(this.rowevent);
    }

	onSelect() {
		// console.log("in Select: ",this.rowevent);
		this.authService.claimEvent(this.rowevent); // it handles its own errors.
    }

	 onDecline() {
		// console.log("in Decline: ",this.rowevent);
        this.authService.declineEvent(this.rowevent);

    }

	onShowTeacher(){
		this.router.navigate(['/events/edit',this.rowevent.ownerId]);
	}
	
	eventIsNotMine() {
		return ((localStorage.getItem('userId') != this.rowevent.ownerId) &&
				(localStorage.getItem('userId') != null)
		) // somebody ELSE has to be logged on
	}

	iHaveNotSelectedThis() {
		// the eventId is not in my list.
		// replicated in the list and in edit component - need to refactor ToDo
		return 	this.authService.notInMyPlannedList(this.rowevent.eventId) && 
				this.authService.notInMyAttendedList(this.rowevent.eventId) ;
	}


	showEdit() {
		return ((localStorage.getItem('userId') == this.rowevent.ownerId) // It must be mine and I must be allowed to edit
			&&	( (this.authService.whoIsLoggedIn().kind == "admin") ||  
				(this.authService.whoIsLoggedIn().kind == "teacher") ))
	}


	iAmAStudent() {
		// console.log("* * * * I am a teacher * * * *",this.authService.whoIsLoggedIn().kind);
		return (this.authService.whoIsLoggedIn().kind == 'student');
	}

	tooManySignedUpAlready() {
		// console.log("* * * * how many signed in * * * *",this.rowevent.name, this.rowevent.participantCount, this.rowevent.participants.length);
		return (this.rowevent.participantCount <= this.rowevent.participants.length);
	}

	ngOnInit () {
		// console.log("in event onInit: ");
		// console.log(this.rowevent);
	}

}
