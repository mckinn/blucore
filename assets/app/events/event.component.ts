// event.component.ts
import { Component, Input } from "@angular/core";
import { Event } from "./event.model";
import { EventService } from "./event.service";

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

    constructor(private eventService: EventService){}

	onEdit() {
		this.eventService.editEvent(this.event);
	}

    onDelete() {
        this.eventService.deleteEvent(this.event)
            .subscribe(
                result => console.log(result)
            );
    }

    belongsToUser() {
        return localStorage.getItem('userId') == this.event.ownerId;
    }
}
