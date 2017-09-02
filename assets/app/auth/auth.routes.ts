
import { Routes } from "@angular/router";

import { AuthenticationComponent } from "./authentication.component";
import { EditComponent } from "./edit.component";
import { SignInComponent } from "./signin.component";
import { UserListComponent } from "./userlist.component";
import { LogoutComponent } from "./logout.component";
import { AuthLandingComponent} from "./auth.landing.component";
import { EventsComponent} from "../events/events.component";
import { EmailComponent} from "../email/email.compose.component";
import { PasswordResetComponent} from "./reset.component";
import { PasswordResetEntryComponent} from "./reset.entry.component";

export const AUTH_ROUTES: Routes = [
    //{ path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: '',       component: AuthLandingComponent, pathMatch: 'full' },
	{ path: 'signin', component: SignInComponent },
	{ path: 'edit', component: EditComponent },
	{ path: 'edit/:userId', component: EditComponent },
	{ path: 'users', component: UserListComponent },
	{ path: 'users/resetpassword/:secret', component: PasswordResetEntryComponent },
	{ path: 'logout', component: LogoutComponent },
	{ path: 'email', component: EmailComponent},
	{ path: 'reset', component: PasswordResetComponent},
	{ path: 'eventsMenu', redirectTo: '/events'}

];
