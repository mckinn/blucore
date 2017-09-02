

import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

import { ErrorService } from "../errors/error.service";
import { AuthService } from "./auth.service";
import { SchoolService } from "../schools/school.service";
import { User } from "./user.model";
import { School } from "../schools/school.model";

@Component ({
	selector: 'app-edit',
	templateUrl: './edit.component.html'
})

export class EditComponent implements OnInit {

	myForm: FormGroup;
	user: User;
	userId: string;
	schoolList: School[] = [];
	urlKind: string;

	// my failed attempt at radio buttons
	// radioItems = 'valid invalid unknown'.split(' ');
	// radioModel = { options: 'unknown' };

	constructor( private authService: AuthService,
				private router: Router,
				private route: ActivatedRoute,
				private location: Location,
				private errorService: ErrorService,
				private schoolService: SchoolService
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
			this.user.userName = this.myForm.value.firstName + " " +
								 this.myForm.value.lastName;
			this.user.wcpssId = this.myForm.value.wcpssId;
			this.user.school = this.myForm.value.school;
			this.user.kind = this.myForm.value.kind;
			this.user.valid = this.myForm.value.valid;
			this.user.phone = this.myForm.value.phone;
			// this should preserve the user.valid value (hopefully)

			this.authService.updateUser( this.user )
				.subscribe(
					data => console.log(data),
					error => console.error(error)
				);
			this.location.back();
			// allow the form to be re-submitted with updates so leave it populated
		} else { // create a new user
			if (this.urlKind) { // then the kind was pre-ordained
				this.myForm.value.kind = this.urlKind ;
			}
			console.log("just before we create a user",this.myForm.value.kind,this.myForm.value.school);
			this.user = new User(
				this.myForm.value.email, 
				this.myForm.value.password, 
				this.myForm.value.firstName, 
				this.myForm.value.lastName,
				this.myForm.value.wcpssId,
				this.myForm.value.school,
				this.myForm.value.kind
				);
			this.user.userName = this.myForm.value.firstName + " " + this.myForm.value.lastName;
			console.log("in submit", this.myForm, this.user);
			this.user.valid = "unknown";
			this.user.phone = this.myForm.value.phone;
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
		// this.location.back();
	
	}

	emailUser() {
		console.log("selecting email button");
		this.authService.setNamedUser(this.user); // declare what user is being edited
		this.router.navigate(['/events/email']);
		// what I want to do is pop up a modal email creation box as a component.  
		// sort of like the /error case.  Lets model it on that.
	}

	goBack() {
		this.location.back();
	}

	isLoggedIn () {
		// console.log("isLoggedIn is: ", this.authService.isLoggedIn());
		return this.authService.isLoggedIn();
	}
	
	isValidatedUser () {
		// console.log("logged in user: ",this.authService.whoIsLoggedIn());
		if (this.authService.isLoggedIn()) {
			// console.log("valid user: ",this.authService.whoIsLoggedIn().userName,this.authService.whoIsLoggedIn().valid);
			return (this.authService.whoIsLoggedIn().valid == "approved");
		}
		return false;
	}
	
	isAdmin () { // determine if the current logged in user is an admin
		return (this.authService.isLoggedIn() && this.authService.whoIsLoggedIn().kind == "admin");
	}

	isMe () {
		return (this.authService.isLoggedIn() && this.userId == this.authService.whoIsLoggedIn().userId);
	}


	buttonIsPresent() {
		/* The ability to submit  something in the user view ( the criteria for the button existence) is…
		• It is me.
		• I am an admin and it is anybody including me (note that admins cannot add users)
		• Nobody is logged in, so it is a signup
		Otherwise there is just no button. */

		if	( !this.authService.isLoggedIn()) return true; // nobody is logged in
		return (( this.authService.whoIsLoggedIn().userId == this.userId ) || // it is me
				( this.authService.whoIsLoggedIn().kind == "admin") // or I'm an admin
		);

	}


	ngOnInit() {

		console.log("* * * * in edit component * * * *");
		this.userId = null;
		let userParm:string;
		

		console.log("* * * * user edit form * * * * ");
		this.myForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			email: new FormControl(null, [
					Validators.required, 
					Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
					]),
			password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
			dupPassword: new FormControl(null, Validators.required),
			wcpssId: new FormControl(null),
			school: new FormControl(null, Validators.required),
			kind: new FormControl(null, Validators.required),
			valid: new FormControl(null, Validators.required),
			phone: new FormControl( null, [
				// Validators.required,
				Validators.pattern("(?:\\+1)?[.(]?(\\d\\d\\d)[.)-]?(\\d\\d\\d)[.,-]?(\\d\\d\\d\\d)|^$")  // standard telephone number pattern
			])
		});
		if ((!this.schoolList) || (this.schoolList.length == 0)) {
			this.schoolService.getSchools()
				.subscribe(
					(schools: School[]) => {
						// console.log('* * * * eventlist on search * * * *');
						// console.log(events);
						this.schoolList = schools;
					}
				);
		}

		// console.log(this.schoolList);


		console.log(this.myForm);
		console.log(this.route.snapshot.params);
		console.log(this.route.url);
		console.log("* * * * in edit component (2) * * * *");

		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			userParm = this.route.snapshot.params['userId'];
			console.log("* * * * parsing parameters * * * *", userParm);
			if (userParm != "teacher" && userParm != "student" && userParm != "admin") { // assume it is an existing user
				console.log("* * * * found a "+userParm + " * * * *");
				this.userId = userParm;
				userParm = null;
			} else {
				this.urlKind = userParm;
			}
		} else {
			if (this.authService.isLoggedIn()) {
				console.log("passed the logged in test");
				this.userId = this.authService.whoIsLoggedIn().userId;
			} 
		}
		console.log("URLKind",this.urlKind);
        // userParm
		if (userParm || !this.isAdmin()) {  // if the user-type was passed in, or the current logged in user is not an Admin..
			// note that the value will get set below if this is an existing user.
			this.myForm.controls['kind'] = new FormControl({value: userParm, disabled: true}, Validators.required);
		}
		// lock the validation down unless it is an admin.
		if (!this.isAdmin()) this.myForm.controls['valid'] = new FormControl({value: "unknown", disabled: true}, Validators.required);


		console.log("before checking this.userId");
		if (this.userId) { // the userid of the logged in user, or of the user specified in the URL
			// ToDo - determine how to do this by throwing an exception.
			if (!this.authService.isLoggedIn()) {
				console.log("re-setting user due to logout");
				this.errorService.handleError(
					this.errorService.loginTimeoutError
				);
				this.router.navigate(['/authentication/signin']);
				return;
			}
			console.log("User ID in edit",this.userId);
			return this.authService.getUser(this.userId)
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
							dupPassword: null, // re-register it
							firstName: user.firstName,   // the ? makes the fields optional
							lastName: user.lastName,
							wcpssId: user.wcpssId, 
							school: user.school,  // wcpss student or teacher ID
							kind: user.kind, // Admin, Student, Teacher, Parent
							valid: user.valid,  // approved, rejected, unknown
							phone: (user.phone || "000.000.0000")
						});
						// If a user is logged and if they are approved their email should not be editable
						if ( this.isMe() && (user.valid == 'approved') ) this.myForm.get('email').disable();
						
						this.myForm.setControl('password', new FormControl("", 
							(c:FormControl) => { return Validators.required}
							)
						);
						this.myForm.setControl('dupPassword', new FormControl("", 
							(c:FormControl) => { return Validators.required }
							)
						);
						
					}

					// the form is diabled if it is filled with data and not owned by me
					// unless an admin has opened it.
					if (!this.buttonIsPresent()) {
						console.log("disable");
						this.myForm.disable();
					}

					console.log("* * * * edit user subscribe - end * * * *");
					console.log(this.myForm);
					console.log(this.user);
					console.log("* * * * edit user subscribe - end * * * *");
				});
		}
		console.log("the kind form value", this.myForm.controls['kind'].value);
	}

}