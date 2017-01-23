import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-authlanding',
    templateUrl: `
    <div class="container">
        <div class="jumbotron col-md-8 col-md-offset-2">
            <h1>Landing Page</h1>
        </div>
    </div>
    `
})
export class AuthLandingComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}