
import { Routes } from "@angular/router";

import { AuthenticationComponent } from "./authentication.component";
import { EditComponent } from "./edit.component";
import { SignInComponent } from "./signin.component";
import { UserListComponent } from "./userlist.component";
import { LogoutComponent } from "./logout.component";
import { AuthLandingComponent} from "./auth.landing.component";

export const AUTH_ROUTES: Routes = [
    //{ path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: '',       component: AuthLandingComponent, pathMatch: 'full' },
	{ path: 'signin', component: SignInComponent },
	{ path: 'edit', component: EditComponent },
	{ path: 'edit/:userId', component: EditComponent },
	{ path: 'users', component: UserListComponent },
	{ path: 'logout', component: LogoutComponent }

];
