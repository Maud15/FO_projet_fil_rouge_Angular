import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

    private static readonly TOKEN_KEY = 'auth-token';
    private static readonly USER_KEY = 'auth-user';

    constructor() { }

    saveToken(token: string){
        window.sessionStorage.setItem(SessionStorageService.TOKEN_KEY, token);
    }
    getToken(){
        return window.sessionStorage.getItem(SessionStorageService.TOKEN_KEY);
    }

    saveUser(user: any){
        window.sessionStorage.setItem(SessionStorageService.USER_KEY, JSON.stringify(user))
    }
    getUser(){
        const user = window.sessionStorage.getItem(SessionStorageService.USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    clearSession() {
        window.sessionStorage.clear();
    }
}
