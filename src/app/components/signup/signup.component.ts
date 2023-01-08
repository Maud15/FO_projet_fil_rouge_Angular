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

    hide = true;
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
        if(this.signupForm.valid) {
            this.userData = {
                "email": this.signupForm.value.email,
                "pseudo": this.signupForm.value.pseudo,
                "password": this.signupForm.value.password,
                "lastname": this.signupForm.value.lastname,
                "firstname": this.signupForm.value.firstname,
                "city": this.signupForm.value.city
            }
            this.authServ.signup(this.userData).subscribe({
                next: () => {
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
