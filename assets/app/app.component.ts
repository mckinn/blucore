import { Component } from '@angular/core';
import { EventService } from './events/event.service';

// decorators - not sure about this.

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html', 
	providers: [EventService]
})

export class AppComponent {

}
