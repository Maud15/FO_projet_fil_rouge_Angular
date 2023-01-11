import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {CalEvent} from "../models/CalEvent";

@Injectable({
  providedIn: 'root'
})
export class EventService {

    baseUrl = 'http://localhost:8080/api/calendar';

    constructor(private http: HttpClient) {
    }

    create(calendarId: number, newEventData: CalEvent): Observable<number> {
        return this.http.post<number>(`${this.baseUrl}/${calendarId}/event`, newEventData);
    }
    getById(calendarId: number, eventId: number):Observable<CalEvent> {
        return this.http.get<CalEvent>(`${this.baseUrl}/${calendarId}/event/${eventId}`);
    }
    getAll(calendarId: number): Observable<CalEvent[]> {
        return this.http.get<CalEvent[]>(`${this.baseUrl}/${calendarId}/events`);
    }
    update(calendarId: number, eventId: number, newData: CalEvent): Observable<CalEvent> {
        return this.http.put<CalEvent>(`${this.baseUrl}/${calendarId}/event/${eventId}`, newData);
    }
    delete(calendarId: number, eventId: number): Observable<any> {
        return this.http.delete<void>(`${this.baseUrl}/${calendarId}/event/${eventId}`);
    }

    createInMain(newEventData: CalEvent): Observable<any> {
        return this.http.post<void>(`${this.baseUrl}/main/event`, newEventData);
    }
    getByIdFromMain(eventId: number):Observable<CalEvent> {
        return this.http.get<CalEvent>(`${this.baseUrl}/main/event/${eventId}`)
    }
    getAllFromMain(): Observable<CalEvent[]> {
        return this.http.get<CalEvent[]>(`${this.baseUrl}/main/events`);
    }
    updateFromMain(calendarId: number, eventId: number, newData: CalEvent): Observable<CalEvent> {
        return this.http.put<CalEvent>(`${this.baseUrl}/main/event/${eventId}`, newData);
    }
    deleteFromMain(eventId: number): Observable<any> {
        return this.http.delete<void>(`${this.baseUrl}/main/event/${eventId}`);
    }
}
