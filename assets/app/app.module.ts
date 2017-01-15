import { NgModule }   from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { EventComponent } from "./events/event.component";
import { EventListComponent } from "./events/event-list.component";
import { eventInputComponent } from "./events/event-input.component";
import { EventsComponent } from "./events/events.component";

import { AuthenticationComponent } from "./auth/authentication.component";
import { LogoutComponent } from "./auth/logout.component";
import { SignUpComponent } from "./auth/signup.component";
import { SignInComponent } from "./auth/signin.component";
import { UserListComponent } from "./auth/userlist.component";


import { AuthService } from "./auth/auth.service";
import { ErrorService } from "./errors/error.service";

import { HeaderComponent } from "./header.component";
import { routing } from "./app.routing";
import { ErrorComponent } from "./errors/error.component";


@NgModule({
    declarations: [
        AppComponent,
        EventComponent,
        EventListComponent, 
        eventInputComponent,
        EventsComponent,
        AuthenticationComponent, 
        HeaderComponent,
        LogoutComponent,
        SignUpComponent, 
        SignInComponent,
        UserListComponent,
        ErrorComponent
    ],
    providers: [AuthService, ErrorService],
    imports: [BrowserModule, FormsModule, routing, ReactiveFormsModule, HttpModule],
    bootstrap: [AppComponent]
})

export class AppModule {

}