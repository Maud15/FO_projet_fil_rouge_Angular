import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;

    constructor(private authService: AuthService,private formBuilder: FormBuilder) {
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
                console.log('CONNECTED : ' + isConnected)
            },
            error: (err) => {
                console.log(err)
            }
        });
    }

}
