import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {FullCalendarModule} from "@fullcalendar/angular";

import {AuthInterceptorProviders} from "./helpers/auth.interceptor";

import {AppComponent} from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FullCalendarComponent } from './components/calendar/full-calendar/full-calendar.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        FullCalendarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FullCalendarModule
    ],
    providers: [AuthInterceptorProviders],
    bootstrap: [AppComponent]
})
export class AppModule {
}
