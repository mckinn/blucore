

import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthService } from "./auth.service";
import { User } from "./user.model";

@Component ({
	selector: 'app-edit',
	templateUrl: './edit.component.html'
})

export class EditComponent implements OnInit {

	myForm: FormGroup;
	user: User;

	constructor( private authService: AuthService,
				private router: Router,
				private route: ActivatedRoute
		 ) {}

	onSubmit() {
		// if the user has been filled it is because we came in here with data
		// can collapse this to use a single this.user in both cases

		// note - special handling for password on the server side.
		// new entry without one fails
		// replacement entry with one has to generate a new one.

		if (this.user) { // submit an updated user
			this.user.email = this.myForm.value.email; 
			this.user.password = this.myForm.value.password;
			this.user.firstName = this.myForm.value.firstName; 
			this.user.lastName = this.myForm.value.lastName;
			this.user.wcpssId = this.myForm.value.wcpssId;
			this.user.school = this.myForm.value.school;
			this.user.kind = this.myForm.value.kind;

			this.authService.updateUser( this.user )
				.subscribe(
					data => console.log(data),
					error => console.error(error)
				);
			// allow the form to be re-submitted with updates so leave it populated
		} else { // create a new user
			const user = new User(
				this.myForm.value.email, 
				this.myForm.value.password, 
				this.myForm.value.firstName, 
				this.myForm.value.lastName,
				this.myForm.value.wcpssId,
				this.myForm.value.school,
				this.myForm.value.kind
				);

			this.authService.addUser( this.user )
				.subscribe(
					data => console.log(data),
					error => console.error(error)
				);
			// force a form reset, because in spite of the fact that we
			// have values in this.user and the form, we don't have a userId
			// ToDo - see if we can retrieve one from the payload
			// ToDo - catch errors.
			this.myForm.reset(); 
			this.user = null;
		}
		console.log(this.myForm);
		console.log(this.user);
	
	}

	ngOnInit() {

		let userId: string;

		console.log("* * * * editing user * * * * ");
		if (!this.myForm){
			this.myForm = new FormGroup({
				firstName: new FormControl(null, Validators.required),
				lastName: new FormControl(null, Validators.required),
				email: new FormControl(null, [
						Validators.required, 
						Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
						]),
				password: new FormControl(null, Validators.required),
				wcpssId: new FormControl(null, Validators.required),
				school: new FormControl(null, Validators.required),
				kind: new FormControl(null, Validators.required)
			});
		}
		console.log(this.myForm);
		console.log(this.route.params);
		console.log(this.route.url);

		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			console.log("* * * * parsing parameters * * * *");
			userId = this.route.snapshot.params['userId'];
		} else {
			if (this.authService.isLoggedIn) {
				userId = this.authService.whoIsLoggedIn().userId;
			}
		}
		console.log("User ID in edit",userId);
		if (userId) {
			return this.authService.getUser(userId)
			.subscribe( (user: User) => { 
				console.log("* * * * User Edit - subscription activation * * * *");
				console.log(this.myForm);
				console.log(user);
				if (user) {   // if there actually was a parameter...
					console.log("* * * * setting the form * * * *");
					if (!user.kind) user.kind = 'admin';
					this.user = user;
					console.log(this.user);
					this.myForm.setValue({
						email: user.email,
						password: null, // if they change the password we need to 
						                // re-register it
						firstName: user.firstName,   // the ? makes the fields optional
						lastName: user.lastName,
						wcpssId: user.wcpssId, 
						school: user.school,  // wcpss student or teacher ID
						kind: user.kind // Admin, Student, Teacher, Parent
					});
					this.myForm.setControl('password', new FormControl("", 
						(c:FormControl) => { return Validators.required}
						)
					);
				}

				// the form is diabled if it is filled with data and not owned by me.
				// if (false) {
				//	console.log("disable");
				//	this.myForm.disable();
				// }

				console.log("* * * * edit user subscribe - end * * * *");
				console.log(this.myForm);
				console.log(this.user);
				console.log("* * * * edit user subscribe - end * * * *");
			});
		}
	}

}