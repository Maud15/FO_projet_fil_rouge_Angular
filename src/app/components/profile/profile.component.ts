import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
    userModified!: UserData;
    name!: string;
    private subscription!: Subscription;

    constructor(private sessionStorage: SessionStorageService, private http: HttpClient, private userService: UserService, private formBuilder : FormBuilder) {
    }


  ngOnInit(): void {
        this.subscription= this.userService.getUser()
            .subscribe({
                next: (data) =>{
                      this.user = data;
                  },
                  error:(err) =>{
                      console.log(err)
                  }
              });
      this.modifyForm = this.formBuilder.group({
          firstname: [''],
          lastname: [''],
      })
        console.log("Hello2");
        console.log(this.modifyForm.value.email);
  }

  submitUser(){
        this.doModify();
  }

  doModify(){
        let firstname = this.modifyForm.value.firstname;
        let lastname = this.modifyForm.value.lastname;
        this.userModified = {
            "pseudo": this.user.pseudo,
            "email": this.user.email,
            "firstname": firstname,
            "lastname": lastname,
            "city": this.user.city,
            "roleList": this.user.roleList,
            "calendarRightsList": this.user.calendarRightsList,
        }
        // console.log("Salut");
        // console.log(this.userModified);
        this.userService.modifyUser(this.userModified);

  }

}
