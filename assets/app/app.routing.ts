// app.routing.ts

import { Routes, RouterModule } from "@angular/router";

import { EventsComponent }       from "./events/events.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { AUTH_ROUTES }             from "./auth/auth.routes";
import { EVENT_ROUTES }             from "./events/event.routes";

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/events', pathMatch: 'full' },
	{ path: 'events', component: EventsComponent, children: EVENT_ROUTES },
	{ path: 'authentication', component: AuthenticationComponent, children: AUTH_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
