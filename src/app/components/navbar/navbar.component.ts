import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
    }

    onLogout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

}
