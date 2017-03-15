import { Component, OnInit } from '@angular/core';
// import { Router } from "@angular/router";
import { EventService } from './events/event.service';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';

// decorators - not sure about this.

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'  // , providers: [EventService]
})

export class AppComponent implements OnInit{

    constructor( private authService: AuthService,
                 private eventService: EventService //,
                 // private router: Router
                 ){}

    ngOnInit() {

        if (this.authService.isLoggedIn()) { 
            // issue if the user has not expired from the browser.
            // in this case the browser will try and set the user, and we will get an error
            // if we think that we are logged in we should check 
            const userId: string = localStorage.getItem('userId');  // should not be null at this point
            this.authService.setWhoIsLoggedIn ( new User(null,null), userId); // recover the user

        }

    }

}
