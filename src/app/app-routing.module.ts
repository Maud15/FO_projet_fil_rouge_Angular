import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {IsSigninGuardService} from "./helpers/is-signin-guard.service";
import {SignupComponent} from "./components/signup/signup.component";
import {FullCalendarComponent} from "./components/calendar/full-calendar/full-calendar.component";
import {CalendarContainerComponent} from "./components/calendar/calendar-container/calendar-container.component";
import {CalendarListComponent} from "./components/calendar/calendar-list/calendar-list.component";
import {ProfileComponent} from "./components/profile/profile.component";

const routes: Routes = [
    {path: '', redirectTo: 'calendar/main', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'calendars', component: CalendarListComponent, canActivate: [IsSigninGuardService]},
    {path: 'calendar/main', component: CalendarContainerComponent, canActivate: [IsSigninGuardService]},
    {path: 'calendar/:id', component: FullCalendarComponent, canActivate: [IsSigninGuardService]},
    {path: 'user/:pseudo', component: ProfileComponent, canActivate: [IsSigninGuardService]},



    // {path: 'home', component: MyComponent, canActivate: [IsSigninGuardService]},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
