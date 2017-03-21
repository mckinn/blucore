import { Component } from "@angular/core";

@Component ({
	selector: 'app-404error',
    template: `
    <div class="container">
        <div class="jumbotron col-md-12">
            <h1>OOPS</h1>
            <h2>I can't find that !!!</h2>
        </div>
    </div>
    `
})

export class NotFoundErrorComponent {

}