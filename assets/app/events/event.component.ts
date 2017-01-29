// event.component.ts
import { Component, Input } from "@angular/core";
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
	@Input() 
    event: Event; 

    constructor(private eventService: EventService, private authService: AuthService){}

	onEdit() {
		this.eventService.editEvent(this.event);
	}

    onDelete() {
        this.eventService.deleteEvent(this.event)
            .subscribe(
                result => console.log(result)
            );
    }

	 onSelect() {
        this.authService.claimEvent(this.event)
			.subscribe(
                result => console.log("subscription in claimEvent",result),
				error => console.error("error in subscription in claimEvent",error)
			);
    }
	
	showView() {
		return ((localStorage.getItem('userId') != this.event.ownerId) &&
				(localStorage.getItem('userId') != null)
		) // somebody ELSE has to be logged on
	}

	showEdit() {
		return ((localStorage.getItem('userId') == this.event.ownerId) // It must be mine and I must be allowed to edit
			&&	( (this.authService.whoIsLoggedIn().kind == "admin") ||  
				(this.authService.whoIsLoggedIn().kind == "teacher") ))
	}

}
