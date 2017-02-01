import { Routes } from "@angular/router";

import { EventInputComponent } from "./event-input.component";
import { EventListComponent } from "./event-list.component";
import { MyEventListComponent } from "./myevent-list.component";
import { EventLandingComponent} from "./event-landing.component";
import { EditComponent } from "../auth/edit.component";
import { UserListComponent } from "../auth/userlist.component";
import { LogoutComponent } from "../auth/logout.component";

export const EVENT_ROUTES: Routes = [
    //{ path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: '',      component: EventLandingComponent, pathMatch: 'full' },
	{ path: 'input', component: EventInputComponent },
    { path: 'input/:eventId', component: EventInputComponent },
	{ path: 'list',  component: EventListComponent },
    { path: 'mylist',  component: MyEventListComponent },
	{ path: 'edit', component: EditComponent },
	{ path: 'edit/:userId', component: EditComponent },
	{ path: 'users', component: UserListComponent },
	{ path: 'logout', component: LogoutComponent }

];