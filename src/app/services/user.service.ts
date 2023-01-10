import { Injectable } from '@angular/core';
import {SessionStorageService} from "./session-storage.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserData} from "../models/userData";

const baseUrl = 'http://localhost:8080/api';
@Injectable({
  providedIn: 'root'
})
export class UserService {


    constructor(private sessionStorage: SessionStorageService, private http: HttpClient) {
    }

    getUser(): Observable<UserData> {
        return this.http.get<UserData>(`${baseUrl}/users/profile`);
    }
    //TODO pas fini sur la modification de l'utilisateur
    modifyUser(userData: UserData): void{
        this.http.put<UserData>(`${baseUrl}/users/profile`, userData).subscribe();
    }
}
