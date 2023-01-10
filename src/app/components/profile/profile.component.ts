import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder,  FormGroup} from "@angular/forms";
import {Observable, Subscription} from "rxjs";
import { HttpClient } from '@angular/common/http';
import {SessionStorageService} from "../../services/session-storage.service";
import {UserData} from "../../models/userData";
import {UserService} from "../../services/user.service";


@Injectable({
    providedIn: 'root'
})

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    modifyForm!: FormGroup;



    userData! : Observable<UserData>;
    user!: UserData;
    name!: string;
    private subscription!: Subscription;
    isModified = false;

    constructor(private sessionStorage: SessionStorageService, private http: HttpClient, private userService: UserService, private formBuilder : FormBuilder) {
    }


  ngOnInit(): void {
        this.subscription= this.userService.getUser()
            .subscribe({
                next: (data) =>{
                      this.user = data;
                      this.prefillForm();
                  },
                  error:(err) =>{
                      console.log(err)
                  }
              });

  }

  prefillForm(){
      this.modifyForm = this.formBuilder.group({
          firstname: [this.user.firstname],
          lastname: [this.user.lastname],
      });
  }
  submitUser(){
        this.doModify();
  }

  doModify(){
        this.user.firstname = this.modifyForm.value.firstname;
        this.user.lastname = this.modifyForm.value.lastname;
        this.userService.modifyUser(this.user);
        this.toModify();
  }
  toModify(){
        this.isModified = !this.isModified;
  }

}
