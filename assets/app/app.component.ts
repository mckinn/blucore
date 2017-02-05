import { Component, OnInit } from '@angular/core';
import { EventService } from './events/event.service';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';

// decorators - not sure about this.

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'  // , providers: [EventService]
})

export class AppComponent implements OnInit{

    constructor(private authService: AuthService, private eventService: EventService){}

    ngOnInit() {

        if (this.authService.isLoggedIn()) {
            const userId: string = localStorage.getItem('userId');  // should not be null at this point
            this.authService.setWhoIsLoggedIn ( new User(null,null), userId); // recover the user
        }

    }

}
