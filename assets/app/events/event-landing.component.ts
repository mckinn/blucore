import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-eventlanding',
    templateUrl: './event-landing.component.html'
})
export class EventLandingComponent implements OnInit {
      
    fullImagePath: string;

    constructor() {
        this.fullImagePath = '/images/header.png'
    }
   

    ngOnInit() { }
}