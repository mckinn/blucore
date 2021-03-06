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
import { PasswordResetComponent } from "./auth/reset.component";
import { PasswordResetEntryComponent } from "./auth/reset.entry.component";

import { AuthService } from "./auth/auth.service";
import { EventService } from "./events/event.service";
import { AuthLandingComponent } from "./auth/auth.landing.component";
import { EventLandingComponent } from "./events/event-landing.component";
import { EventParticipant } from "./events/event.participant.component";
import { EventFooterComponent } from "./events/eventfooter/footer.component";
import { ErrorService } from "./errors/error.service";
import { SchoolService } from "./schools/school.service";

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
        PasswordResetComponent,
        PasswordResetEntryComponent,
        UserListComponent,
        ErrorComponent,
        AuthLandingComponent,
        EventLandingComponent,
        MyEventListComponent,
        EmailComponent,
        UserComponent,
        NotFoundErrorComponent,
        EventParticipant
    ],
    providers: [AuthService, ErrorService, EventService, CommonHttp, SchoolService],
    imports: [BrowserModule, FormsModule, routing, ReactiveFormsModule, HttpModule],
    bootstrap: [AppComponent]
})

export class AppModule {

}