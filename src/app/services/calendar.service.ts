import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    constructor(private http: HttpClient) { }

    baseUrl = 'http://localhost:8080/api/calendar';

    getById(calId: number){
        return this.http.get(`${this.baseUrl}/${calId}`);
    };

}
