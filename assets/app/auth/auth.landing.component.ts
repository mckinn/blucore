import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-authlanding',
    templateUrl: './auth.landing.component.html'
})
export class AuthLandingComponent implements OnInit {
    
    fullImagePath: string;

    constructor() {
        this.fullImagePath = '/images/header.png'
    }

    ngOnInit() { 
    }
}