// app.routing.ts

import { Routes, RouterModule } from "@angular/router";

import { EventsComponent }       from "./events/events.component";
import { AuthenticationComponent } from "./auth/authentication.component";
import { AUTH_ROUTES }             from "./auth/auth.routes";

const APP_ROUTES: Routes = [
	{ path: '', redirectTo: '/events', pathMatch: 'full' },
	{ path: 'events', component: EventsComponent },
	{ path: 'authentication', component: AuthenticationComponent, children: AUTH_ROUTES }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
