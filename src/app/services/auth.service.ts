import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SessionStorageService} from "./session-storage.service";
import {BehaviorSubject, catchError, map, Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    BASE_URL = 'http://localhost:8080/api/auth';

    private loggedIn = new BehaviorSubject<boolean>(!!this.sessionStorage.getToken());

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    constructor(private http: HttpClient, private sessionStorage: SessionStorageService) { }


    signup(newUserData: User): Observable<any> {
        return this.http
            .post<any>(`${this.BASE_URL}/signup`, newUserData);
    }

    login(pseudo: string, password: string): Observable<any> {
        const signinRequest = {pseudo, password};
        return this.http
            .post<any>(`${this.BASE_URL}/signin`, signinRequest)
            .pipe(
                map( (jwtResponse: any) => {
                    this.sessionStorage.saveToken(jwtResponse.token);
                    this.sessionStorage.saveUser(jwtResponse.pseudo);
                    return true;
                }),
                catchError(() => {
                    throw new Error(`Error login for pseudo : ${pseudo}`)
                })
            );
    }

    logout() {
        this.loggedIn.next(false);
        this.sessionStorage.clearSession();
    }

    isConnected(): boolean {
        return !!this.sessionStorage.getToken();
    }
}
