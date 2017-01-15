// events.component.ts
import { Component } from "@angular/core";

@Component({
	selector: 'app-events', 
	template: `
		<div class="row">
			<app-event-input></app-event-input>
		</div>
		<hr>
		<div class="row">
			<app-event-list></app-event-list>
		</div>
	`


})
export class EventsComponent {

}