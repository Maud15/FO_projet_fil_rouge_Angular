import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.onSignIn();
    }

    onSignIn(): void {
        const pseudo = 'Maud2';
        const password = 'toto2';

        this.authService.login(pseudo, password).subscribe({
            next: (isConnected: boolean) => {
                console.log('CONNECTED : ' + isConnected)
            },
            error: (err) => {
                console.log(err)
            }
        });
    }

}
