import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {
    CalendarOptions,
    DateSelectArg,
    EventClickArg,
    EventApi,
    EventRemoveArg,
    CalendarApi, EventInput, EventChangeArg, EventDropArg
} from '@fullcalendar/core';
import interactionPlugin, {EventResizeDoneArg} from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import frLocale from "@fullcalendar/core/locales/fr";
import {EventService} from "../../services/event.service";
import {CalEvent} from "../../models/CalEvent";
import {EventImpl} from "@fullcalendar/core/internal";
import {UserService} from "../../services/user.service";
import {UserData} from "../../models/userData";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent implements OnInit {
    calendarVisible = true;
    calendarOptions: CalendarOptions = {
        locale: frLocale,
        plugins: [
            interactionPlugin,
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
        ],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        weekends: true,
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        select: this.handleDateSelect.bind(this),
        eventClick: this.handleEventClick.bind(this),
        eventsSet: this.handleEvents.bind(this),
        /* you can update a remote database when these fire:
        eventAdd:
        */
        eventChange:this.updateEvent.bind(this),
        eventDrop: this.moveEvent.bind(this),
        eventResize: this.resizeEvent.bind(this),
        eventRemove:this.deleteEvent.bind(this)
    };
    currentEvents: EventApi[] = [];
    hideSidebar: boolean = true;
    events: any;
    mainCalendar: boolean = true;
    calendarId!: number;
    user: UserData = {
        'email': '',
        'pseudo': '',
        'lastname': '',
        'firstname': '',
        'city': '',
        "roleList": ''
    };

    constructor(private activatedRoute: ActivatedRoute, private changeDetector: ChangeDetectorRef, private userService: UserService, private eventService: EventService) {
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(paramsId => {
            this.calendarId = paramsId['id'];
        })
        if(this.calendarId != undefined) {
            this.mainCalendar = false;
        }
        this.getAll();
        this.getUser();
    }

    getFormattedEventData(res: CalEvent[]): EventInput[] {
        let formattedData: EventInput[] = [];
        res.forEach(event => {
            if(event.startDate != null && event.startDate.indexOf("T") < 0) {
                event.startDate += 'T00:00:00';
            }
            if(event.endDate != null && event.endDate.indexOf("T") < 0) {
                event.endDate += 'T00:00:00';
            }
            let formattedEvent: EventInput = {
                id: event.id != undefined ? ''+event.id : undefined,
                title: event.title,
                start: event.startDate != null ? event.startDate : undefined,
                end: event.endDate != null ? event.endDate : undefined,
                fullDay: event.fullDay
            }
            formattedData.push(formattedEvent);
        })
        return formattedData;
    }

    handleWeekendsToggle() {
        const { calendarOptions } = this;
        calendarOptions.weekends = !calendarOptions.weekends;
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        const title = prompt('Nom de l\'évènement');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            let addInfo: CalEvent = {
                title,
                startDate: selectInfo.startStr,
                endDate: selectInfo.endStr,
                fullDay: selectInfo.allDay
            };

            this.createEvent(calendarApi, addInfo);
        }
    }

    handleEventClick(clickInfo: EventClickArg) {
        this.eventService.getById(1, parseInt(clickInfo.event.id)).subscribe({
            next: (res) => {console.log(res)},
            error: (err) => console.log(err.name)

        });
        if (confirm(`Voulez-vous supprimer cet évènement : '${clickInfo.event.title}' ?`)) {
            clickInfo.event.remove();
        }
    }

    handleEvents(events: EventApi[]) {
        this.currentEvents = events;
        this.changeDetector.detectChanges();
    }

    moveEvent(eventDropInfo: EventDropArg) {
        let event = {
            oldData: eventDropInfo.oldEvent,
            newData: eventDropInfo.event,
            revert: () => {eventDropInfo.revert()}
        }
        this.updateDateEvent(event);
    }
    resizeEvent(eventResizeInfo: EventResizeDoneArg) {
        let event = {
            oldData: eventResizeInfo.oldEvent,
            newData: eventResizeInfo.event,
            revert: () => {eventResizeInfo.revert()}
        }
        this.updateDateEvent(event);
    }


/* -----   My Code   ----- */

    toggleSidebar(): void {
        this.hideSidebar = !this.hideSidebar;
        const $sidebar = document.getElementById('calendar-sidebar');
        if( $sidebar != null) {
            let $toggleButton = $sidebar.getElementsByClassName('toggle-sidebar')[0];
            $toggleButton.classList.toggle('fc-icon-chevrons-left');
            $toggleButton.classList.toggle('fc-icon-chevrons-right');
            $sidebar.classList.toggle('closed');
            if($sidebar.classList.contains('closed')) {
                $sidebar.style.left = `${-this.calcSidebarWidth()}px`;
                $sidebar.style.position = `absolute`;
            } else {
                $sidebar.style.left = `0px`;
                $sidebar.style.position = `relative`;
                // $sidebar.style.width = 'inherit';//((30/100) * document.getElementsByTagName('body')[0].offsetWidth) + 'px';
            }
        }
    }
    calcSidebarWidth():number {
        const $sidebar = document.getElementById('calendar-sidebar');
        return $sidebar !== null ? $sidebar.offsetWidth : 0;
    }
    toggleSidebarSection($event: MouseEvent, eltId: string): void {
        const $section = document.getElementById(eltId);
        if($section != null && $event.target instanceof Element) {
            $section.classList.toggle('closed');
            $event.target.getElementsByClassName('fc-icon')[0].classList.toggle('rotate90');
        }
    }


/* -----   Messages   ----- */

    createInfoMsg(msg: string): void {
        this.createMsg('info-message', msg);
    }
    createWarnMsg(msg: string): void {
        this.createMsg('warn-message', msg);
    }
    createMsg(type: string, msg: string): void {
        let infoTxt = document.createElement('p').innerText = msg;
        let infoMsg = document.createElement('div');
        infoMsg.classList.add('toast');
        infoMsg.classList.add(type);
        infoMsg.append(infoTxt);
        let $calendar = document.getElementById("calendar-main");
        if($calendar != null) {
            $calendar.append(infoMsg);
        }
        let time = 2000;
        if(type === 'info-message') {
            time = 1500;
        }
        setTimeout( () => {
            infoMsg.classList.add('removing');
            setTimeout( () => {
                infoMsg.remove();
            },time);
        },time);
    }

    isById() {
        return !this.mainCalendar && this.calendarId !== undefined && this.calendarId !== null
    }

    getUser() {
        let user;
        if(this.isById()) {
            user = this.userService.getUserByCalendarId(this.calendarId);
        } else {
            user = this.userService.getUser();
        }
        user.subscribe({
            next: (user) => this.user = user,
            error: (err) => console.log(err)
        })
    }

/* -----   CRUD EVENTS   ----- */

    getAll() {
        let all;
        if(this.isById()) {
            all = this.eventService.getAll(this.calendarId);
        } else {
            all = this.eventService.getAllFromMain();
        }
        all.subscribe({
            next: (res) => {
                this.events = this.getFormattedEventData(res);
                console.log(this.events);
            },
            error: (err) => {
                this.createWarnMsg(err.name);
                console.log(err)
            }
        })
    }

    createEvent(calendarApi:  CalendarApi, addInfo: CalEvent): void {
        let create;
        if(this.isById()) {
            create = this.eventService.create(this.calendarId, addInfo);
        } else {
            create = this.eventService.createInMain(addInfo);
        }
        create.subscribe({
            next: (newEventId) => {
                this.createInfoMsg(`Evènement -${addInfo.title}- créé`);
                addInfo.id = newEventId;
                if(addInfo.id != undefined && addInfo.startDate != null && addInfo.endDate != null) {
                    calendarApi.addEvent({
                        id: addInfo.id.toString(),
                        title: addInfo.title,
                        start: new Date(addInfo.startDate),
                        end: new Date(addInfo.endDate),
                        allDay: addInfo.fullDay
                    });
                }
            },
            error: (err) => {
                this.createWarnMsg(err.name);
                console.log(err)
            }
        })
    }
    updateDateEvent(event: {oldData: EventImpl, newData: EventImpl, revert: Function}) {
        let newEventData: CalEvent = {
            title: event.oldData.title,
            startDate: event.newData.start != null ? event.newData.start.toISOString() : null,
            endDate: event.newData.end != null ? event.newData.end.toISOString() : null,
            fullDay: event.newData.allDay
        }
        let update;
        if(this.isById()) {
            update = this.eventService.update(this.calendarId, parseInt(event.oldData.id), newEventData);
        } else {
            update = this.eventService.updateFromMain(parseInt(event.oldData.id), newEventData);
        }
        update.subscribe({
            next: () => {
                this.createInfoMsg(`Evènement -${newEventData.title}- mis à jour`);
            },
            error: (err) => {
                this.createWarnMsg(err.name);
                console.log(err)
                event.revert();
            }
        })
    }
    updateEvent(updateInfo: EventChangeArg): void {
        let oldInfo = updateInfo.oldEvent;
        let newEventData: CalEvent = {
            title: updateInfo.event.title,
            startDate: oldInfo.start != null ? oldInfo.start.toISOString() : null,
            endDate: oldInfo.end != null ? oldInfo.end.toISOString() : null,
            fullDay: oldInfo.allDay
        }
        let update;
        if(this.isById()) {
            update = this.eventService.update(this.calendarId, parseInt(updateInfo.oldEvent.id), newEventData);
        } else {
            update = this.eventService.updateFromMain(parseInt(updateInfo.oldEvent.id), newEventData);
        }
        update.subscribe({
            next: () => {
                this.createInfoMsg(`Evènement -${newEventData.title}- mis à jour`);
            },
            error: (err) => {
                this.createWarnMsg(err.name);
                console.log(err)
            }
        })
    }
    deleteEvent(removeInfo: EventRemoveArg):void {
        let eventTitle = removeInfo.event.title;
        this.eventService.deleteFromMain(parseInt(removeInfo.event.id)).subscribe({
            next: () => {
                this.createInfoMsg(`Evènement -${eventTitle}- supprimé`);
            },
            error: (err) => {
                this.createWarnMsg(err.name);
                console.log(err)
            }
        });
    }
}
