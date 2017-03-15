

import { Headers } from "@angular/http";

export class CommonHttp {

    // constructor ( private headers:Headers ){}

    setHeaders () {

		let localToken = localStorage.getItem('token');
		if (localToken != null) {
			return new Headers({'Content-Type': 'application/json','X-token':localToken})
		} else {
			return new Headers({'Content-Type': 'application/json'})
		}
	};
}