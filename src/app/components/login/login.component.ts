import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    hide = true;
    loginForm!: FormGroup;

    constructor(private authService: AuthService,private formBuilder: FormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            pseudo: ['', Validators.required],
            password: ['', Validators.required]
        })
    }

    onSignIn(): void {
        this.authService.login(this.loginForm.value.pseudo, this.loginForm.value.password).subscribe({
            next: (isConnected: boolean) => {
                console.log('CONNECTED AS ' + this.loginForm.value.pseudo);
                this.router.navigate(['/home']);
            },
            error: (err) => {
                console.log(err)
            }
        });
    }

}
