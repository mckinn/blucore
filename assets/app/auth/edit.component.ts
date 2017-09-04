

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
	urlQparm: string;

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
			console.log(" in editcomponents - onsubmit - form:", this.myForm.value);
			console.log(" in editcomponents - onsubmit - user:", this.user);
			this.user.email = this.myForm.value.email; 
			this.user.password = this.myForm.value.password;
			this.user.firstName = this.myForm.value.firstName; 
			this.user.lastName = this.myForm.value.lastName;
			this.user.userName = this.myForm.value.firstName + " " +
								 this.myForm.value.lastName;
			this.user.emailValid = this.myForm.value.emailValid;
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
				false,
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
			this.errorService.handleError(
				this.errorService.newUserDoneNotice
				);
			this.router.navigate(['/']);

			this.myForm.reset(); 
			this.user = null;
		}
		console.log(this.myForm);
		console.log(this.user);
		
	
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
		// console.log("checking admin: ",this.authService.isLoggedIn(),this.authService.whoIsLoggedIn().kind);
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

	derivedEmailPattern ( 	userType: string, // student, teacher, admin
							formUse:  string,  // new (no prespecified type} , usertype, self, new)
							overRide: boolean ) {

		// start with student as the most restrictive..
		console.log("checking the email pattern", userType, formUse, overRide);
		let pattern: string = "[a-z,A-Z,0-9,\+\.\-\_]+@student\.wcpss\.net";

		if (!overRide) {
			if ( (userType == "teacher") || (userType == "admin")) {
				console.log("setting things to teacher/admin");
				pattern = "[a-z,A-Z,0-9,\+\.\-\_]+@wcpss\.net";  // admin or teacher
			}
		} else { // the override case - any valid email.
			console.log("setting things to override");
			pattern = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?";
		}
		// note that the default for missing parameters, etc is 'student'
		// we need to set the form up with dynamic validation to help improve the experience
		return pattern; 
	}

	ngOnInit() {

		console.log("* * * * in edit component * * * *");
		this.userId = null;
		let userParm: string;
		let userLoginType: string;

		console.log("* * * * user edit form * * * * ");
	/* 		this.myForm = new FormGroup({
				firstName: new FormControl(null, Validators.required),
				lastName: new FormControl(null, Validators.required),
				email: new FormControl(null, [
						Validators.required, 
						// generic email pattern
						Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
						]),
				password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
				dupPassword: new FormControl(null, Validators.required),
				school: new FormControl(null, Validators.required),
				kind: new FormControl(null, Validators.required),
				valid: new FormControl(null, Validators.required),
				phone: new FormControl( null, [
					// Validators.required,
					Validators.pattern("(?:\\+1)?[.(]?(\\d\\d\\d)[.)-]?(\\d\\d\\d)[.,-]?(\\d\\d\\d\\d)|^$")  // standard telephone number pattern
				])
			}); */
		this.myForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			email: new FormControl(null, [
					Validators.required, 
					Validators.pattern("[a-z,A-Z,0-9,\+\.\-\_]+@student\.wcpss\.net|[a-z,A-Z,0-9,\+\.\-\_]+@wcpss\.net")
					]),
			password: new FormControl(null, [Validators.required, Validators.minLength(5)]),
			dupPassword: new FormControl(null, Validators.required),
			school: new FormControl(null, Validators.required),
			kind: new FormControl(null, Validators.required),
			valid: new FormControl(null, Validators.required),
			phone: new FormControl( null, [
				// Validators.required,
				Validators.pattern("(?:\\+1)?[.(]?(\\d\\d\\d)[.)-]?(\\d\\d\\d)[.,-]?(\\d\\d\\d\\d)|^$")  // standard telephone number pattern
			])
		});
		console.log("* * * * after formgroup 111 * * * * ");

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

		console.log("schools: ",this.schoolList);

		console.log("Form:", this.myForm);
		console.log("p:",this.route.snapshot.params);
		console.log("qp:",this.route.snapshot.queryParams);
		console.log("Url:",this.route.url);
		console.log("* * * * in edit component (2) * * * *");

		this.urlQparm = this.route.snapshot.queryParams['emailFormat'];

		if (!(Object.keys(this.route.snapshot.params).length === 0 && this.route.snapshot.params.constructor === Object)) {
			userParm = this.route.snapshot.params['userId'];
			console.log("* * * * parsing parameters * * * *", userParm);
			if (userParm != "teacher" && userParm != "student" && userParm != "admin") { // assume it is an existing user
				console.log("* * * * found a "+userParm + " * * * *");
				this.userId = userParm;
				userParm = null;
				userLoginType = "userid";
			} else {
				this.urlKind = userParm;  // urlKind contains one of the official kinds, and we are adding a new user of that kind
				userLoginType = "usertype";
			}
		} else {
			if (this.authService.isLoggedIn()) {
				console.log("passed the logged in test");
				this.userId = this.authService.whoIsLoggedIn().userId;
				userLoginType = "self";
				userParm = this.authService.whoIsLoggedIn().kind;
			} else {
				console.log("this is the addition of a user using the default url");
				userLoginType = "new";
			}
		}
		console.log("URLKind",this.urlKind);
		// set up the limitations on the form
		console.log("userLoginType: ", userLoginType );
		console.log("this.admin:", this.isAdmin());

		if ( !( (userLoginType == "new") || (userLoginType == "userid" && this.isAdmin() ) ) ) {  // if it is a new user, or an existing user with an admin, don't lock down the kind.
			// note that the value will get set below if this is an existing user.
			console.log("disabling kind: (userlogintype, isAdmin)", userLoginType, this.isAdmin() );
			this.myForm.controls['kind'] = new FormControl({value: userParm, disabled: true}, Validators.required);
		}
		// lock the validation down unless it is admin for an existing user.
		if (!(this.isAdmin() && (userLoginType == "userid"))) {
			console.log("disabling valid: (userlogintype, isAdmin)", userLoginType, this.isAdmin()  );
			this.myForm.controls['valid'] = new FormControl({value: null, disabled: true}, Validators.required);
		}

		console.log("checking for the type of email pattern: (urlQparm, restrictions)",this.urlQparm,process.env.EMAIL_RESTRICTIONS );

		this.myForm.controls['email'] = 
			new FormControl(null,
				Validators.pattern(
					this.derivedEmailPattern ( 	
						this.urlKind, // student, teacher, admin
						userLoginType,  // new (no prespecified type} , usertype, self, new)
						( this.urlQparm && (this.urlQparm == "generic")) ) ) )

		console.log("before checking this.userId", this.myForm);

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

					console.log("* * * * User Edit * * * *");
					console.log(this.myForm);
					console.log(user);
					if (user) {   // if there actually was a parameter...
						console.log("* * * * setting the form * * * *");
						if (!user.kind) user.kind = 'admin';
						this.user = user;
						console.log(this.user);
						this.myForm.setValue({
							email: user.email,
							password: user.password,  
							dupPassword: user.password, 
							firstName: user.firstName,  
							lastName: user.lastName,
							school: user.school,  
							kind: user.kind, // Admin, Student, Teacher, Parent
							valid: user.valid,  // approved, rejected, unknown
							phone: (user.phone || "000.000.0000")
						});
						// If a user is logged and if they are approved their email should not be editable
						if ( this.isMe() && (user.valid == 'approved') ) this.myForm.get('email').disable();
						
						this.myForm.setControl('password', new FormControl("", 
							(c:FormControl) => { return Validators.minLength(5)}
							)
						);
						this.myForm.setControl('dupPassword', new FormControl("", 
							(c:FormControl) => { return Validators.minLength(5) }
							)
						); 
						this.myForm.setControl('email', new FormControl(user.email, 
							(c:FormControl) => 
								{ return Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
								})
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
		} else {
			this.myForm.patchValue({school:"Athens Drive High School"});
			this.myForm.patchValue({valid:"unknown"});
			console.log("Setting the school to athens ",this.myForm);
		}
		console.log("the kind form value", this.myForm.controls['kind'].value);
	}

	get email() { return this.myForm.get('email'); }

}