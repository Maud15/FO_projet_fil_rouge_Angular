import {Component} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'FO_Projet_Fil_Rouge';
    isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn;

    constructor(private authService: AuthService) {
    }

    onLogout() {
        this.authService.logout();
    }
}
