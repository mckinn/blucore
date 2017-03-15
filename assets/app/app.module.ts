import { NgModule }   from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { EventComponent } from "./events/event.component";
import { EventListComponent } from "./events/event-list.component";
import { EventInputComponent } from "./events/event-input.component";
import { EventsComponent } from "./events/events.component";
import { MyEventListComponent } from "./events/myevent-list.component";

import { AuthenticationComponent } from "./auth/authentication.component";
import { LogoutComponent } from "./auth/logout.component";
import { EditComponent } from "./auth/edit.component";
import { SignInComponent } from "./auth/signin.component";
import { UserListComponent } from "./auth/userlist.component";


import { AuthService } from "./auth/auth.service";
import { EventService } from "./events/event.service";
import { AuthLandingComponent } from "./auth/auth.landing.component";
import { EventLandingComponent } from "./events/event-landing.component";
import { ErrorService } from "./errors/error.service";

import { HeaderComponent } from "./header.component";
import { routing } from "./app.routing";
import { ErrorComponent } from "./errors/error.component";
import { NotFoundErrorComponent } from "./errors/404.error.component";
import { UserComponent } from "./auth/user.component";

import { EmailComponent } from "./email/email.compose.component";

import { CommonHttp } from "./common/common.http";


@NgModule({
    declarations: [
        AppComponent,
        EventComponent,
        EventListComponent, 
        EventInputComponent,
        EventsComponent,
        AuthenticationComponent, 
        HeaderComponent,
        LogoutComponent,
        EditComponent, 
        SignInComponent,
        UserListComponent,
        ErrorComponent,
        AuthLandingComponent,
        EventLandingComponent,
        MyEventListComponent,
        EmailComponent,
        UserComponent,
        NotFoundErrorComponent
    ],
    providers: [AuthService, ErrorService, EventService, CommonHttp],
    imports: [BrowserModule, FormsModule, routing, ReactiveFormsModule, HttpModule],
    bootstrap: [AppComponent]
})

export class AppModule {

}