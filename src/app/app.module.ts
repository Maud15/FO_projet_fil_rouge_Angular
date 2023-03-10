import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {FullCalendarModule} from "@fullcalendar/angular";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import {AuthInterceptorProviders} from "./helpers/auth.interceptor";

import {AppComponent} from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { FullCalendarComponent } from './components/full-calendar/full-calendar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CalendarListComponent } from './components/calendar-list/calendar-list.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        FullCalendarComponent,
        NavbarComponent,
        CalendarListComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FullCalendarModule,
        //Angular material
        BrowserAnimationsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule

    ],
    providers: [AuthInterceptorProviders],
    bootstrap: [AppComponent]
})
export class AppModule {
}
