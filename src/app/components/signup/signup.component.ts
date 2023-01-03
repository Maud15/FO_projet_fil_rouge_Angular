import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    signupForm!: FormGroup;
    userData!: User;
    constructor(private authServ: AuthService, private formBuilder: FormBuilder, private router: Router) { }

    ngOnInit(): void {
        this.signupForm = this.formBuilder.group({
            email: ['', [Validators.required,Validators.email]],
            pseudo: ['', Validators.required],
            password: ['', Validators.required],
            lastname: [''],
            firstname: [''],
            city: [''],
        })
    }

    doSignup(): boolean {
        let email = this.signupForm.value.email;
        let pseudo = this.signupForm.value.pseudo;
        let password = this.signupForm.value.password;
        if(this.signupForm.valid) {
            this.userData = {
                "email": email,
                "pseudo": pseudo,
                "password": password,
                "lastname": this.signupForm.value.lastname,
                "firstname": this.signupForm.value.firstname,
                "city": this.signupForm.value.city
            }
            this.authServ.signup(this.userData).subscribe({
                next: (result) => {
                    this.router.navigate(['/login']);
                },
                error: (err) => alert(err)
            });
        }
        return false;
    }

    get f() {
        return this.signupForm.controls;
    }
}
