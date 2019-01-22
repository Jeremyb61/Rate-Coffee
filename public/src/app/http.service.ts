import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private _http: HttpClient) { }

    addCoffee(newCoffee) {
        return this._http.post('/coffee', newCoffee)
    }
    getCoffees() {
        return this._http.get('/coffee')
    }
    rateCoffee(id, coffees) {
        return this._http.post('/coffee/' + id, coffees)
    }
    showDets(coffeeDets) {
        return this._http.get('/coffee/' + coffeeDets._id)
    }

}
