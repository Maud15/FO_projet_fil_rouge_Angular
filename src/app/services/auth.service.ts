import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SessionStorageService} from "./session-storage.service";
import {catchError, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    BASE_URL = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient, private sessionStorage: SessionStorageService) { }

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
}
