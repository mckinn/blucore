
import { Routes } from "@angular/router";

import { AuthenticationComponent } from "./authentication.component";
import { SignUpComponent } from "./signup.component";
import { SignInComponent } from "./signin.component";
import { UserListComponent } from "./userlist.component";
import { LogoutComponent } from "./logout.component";

export const AUTH_ROUTES: Routes = [
    { path: '', redirectTo: 'signup', pathMatch: 'full' },
    // { path: '',       component: AuthenticationComponent, pathMatch: 'full' },
	{ path: 'signin', component: SignInComponent },
	{ path: 'signup', component: SignUpComponent },
	{ path: 'userlist', component: UserListComponent },
	{ path: 'logout', component: LogoutComponent }

];
