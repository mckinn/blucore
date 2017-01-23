
import { Routes } from "@angular/router";

import { AuthenticationComponent } from "./authentication.component";
import { SignUpComponent } from "./signup.component";
import { SignInComponent } from "./signin.component";
import { UserListComponent } from "./userlist.component";
import { LogoutComponent } from "./logout.component";
import { AuthLandingComponent} from "./auth.landing.component";

export const AUTH_ROUTES: Routes = [
    //{ path: '', redirectTo: 'signin', pathMatch: 'full' },
    { path: '',       component: AuthLandingComponent, pathMatch: 'full' },
	{ path: 'signin', component: SignInComponent },
	{ path: 'signup', component: SignUpComponent },
	{ path: 'users', component: UserListComponent },
	{ path: 'logout', component: LogoutComponent }

];
