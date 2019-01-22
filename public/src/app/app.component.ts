import { Component } from '@angular/core';
import { HttpService } from './http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    newCoffee: any;
    showCoffees: any;
    details: any;
    nameError: any;
    varietalError: any;
    regionError: any;
    imageError: any;
    constructor(private _httpService: HttpService) { }
    ngOnInit() {
        this.newCoffee = { roastername: '', varietal: '', region: '', image: '' }
        this.getAllCoffees()
    }
    add() {
        let observable = this._httpService.addCoffee(this.newCoffee);
        observable.subscribe((data) => {
            console.log("Hit the add method", data)
            if (data['status']) {
                this.newCoffee = { roastername: '', varietal: '', region: '', image: '' }
                this.getAllCoffees()
            } else {
                if (data['err']['errors']['roastername']) {
                    this.nameError = data['err']['errors']['roastername']['message'];
                }
                if (data['err']['errors']['varietal']) {
                    this.varietalError = data['err']['errors']['varietal']['message'];
                }
                if (data['err']['errors']['region']) {
                    this.regionError = data['err']['errors']['region']['message'];
                }
                if (data['err']['errors']['image']) {
                    this.imageError = data['err']['errors']['image']['message'];
                }
            }
        });
    }
    getAllCoffees() {
        let observable = this._httpService.getCoffees();
        observable.subscribe((data) => {
            console.log("Showing all Coffees", data)
            this.showCoffees = data;
        });
    }
    comment(id, coffees) {
        console.log("coffees @@@@@@@@@@@@@", coffees);
        let observable = this._httpService.rateCoffee(id, coffees.value);
        console.log("recieved data from server", coffees)
        observable.subscribe(coffees => {
            console.log(`Attempting to submit rating on coffee by id ${coffees}`)
        })
    }
    showDetails(coffeeDets) {
        let observable = this._httpService.showDets(coffeeDets)
        observable.subscribe(data => {
            console.log(coffeeDets);
            this.details = data;
        })
    }
}
