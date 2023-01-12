import {CalendarRightsList} from "./CalendarRightsList";

export interface UserData {
    'email': String,
    'pseudo': String,
    'lastname': String,
    'firstname': String,
    'city': String,
    "roleList": String,
    "calendarRightsList"?: CalendarRightsList,
}
