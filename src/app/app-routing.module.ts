import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {IsSigninGuardService} from "./helpers/is-signin-guard.service";
import {SignupComponent} from "./components/signup/signup.component";
import {FullCalendarComponent} from "./components/calendar/full-calendar/full-calendar.component";

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    //TODO : remove when home is implemented
    {path: 'home', redirectTo: 'calendar', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'calendar', component: FullCalendarComponent/*, canActivate: [IsSigninGuardService]*/},
    // {path: 'home', component: MyComponent, canActivate: [IsSigninGuardService]},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
