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

@Component({
  selector: 'app-full-calendar',
  templateUrl: './full-calendar.component.html',
  styleUrls: ['./full-calendar.component.css']
})
export class FullCalendarComponent implements OnInit{
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
    hideSidebar: boolean =true;
    events: any;

    constructor(private changeDetector: ChangeDetectorRef, private eventService: EventService) {
    }

    ngOnInit(): void {
        this.eventService.getAll(1).subscribe({
            next: (res) => {
                this.events = this.getFormattedEventData(res);
                console.log(this.events);
            }
        })
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
                start: event.startDate != null ? new Date(event.startDate) : undefined,
                end: event.endDate != null ? new Date(event.endDate) : undefined,
                fullDay: event.fullDay
            };
            formattedData.push(formattedEvent);
        })
        return formattedData;
    }

    handleWeekendsToggle() {
        const { calendarOptions } = this;
        calendarOptions.weekends = !calendarOptions.weekends;
    }

    handleDateSelect(selectInfo: DateSelectArg) {
        const title = prompt('Please enter a new title for your event');
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
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove();
        }
    }

    handleEvents(events: EventApi[]) {
        this.currentEvents = events;
        this.changeDetector.detectChanges();
    }

    toggleSidebar($event: MouseEvent): void {
        this.hideSidebar = !this.hideSidebar;
        document.getElementsByTagName('app-sidebar')[0].classList.toggle('closed');
        if($event.target instanceof Element) {
            $event.target.classList.toggle('closed');
        }
        console.log(document.getElementsByTagName('app-sidebar')[0]);
    }

    createEvent(calendarApi:  CalendarApi, addInfo: CalEvent): void {
        let calendarId = 1;
        this.eventService.create(calendarId, addInfo).subscribe({
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

    deleteEvent(removeInfo: EventRemoveArg):void {
        let calendarId = 1;
        let eventTitle = removeInfo.event.title;
        this.eventService.delete(calendarId, parseInt(removeInfo.event.id)).subscribe({
            next: () => {
                this.createInfoMsg(`Evènement -${eventTitle}- supprimé`);
            },
            error: (err) => {
                this.createWarnMsg(err.name);
                console.log(err)
            }
        });
    }
    updateEvent(updateInfo: EventChangeArg): void {
        let calendarId = 0;
        let oldInfo = updateInfo.oldEvent;
         let newEventData: CalEvent = {
             title: updateInfo.event.title,
             startDate: oldInfo.start != null ? oldInfo.start.toISOString() : null,
             endDate: oldInfo.end != null ? oldInfo.end.toISOString() : null,
             fullDay: oldInfo.allDay
         }
        this.eventService.update(calendarId, parseInt(updateInfo.oldEvent.id), newEventData).subscribe({
            next: () => {
                this.createInfoMsg(`Evènement -${newEventData.title}- mis à jour`);
            },
            error: (err) => {
                console.log(err)
            }
        })
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

    updateDateEvent(event: {oldData: EventImpl, newData: EventImpl, revert: Function}/*oldEvent: EventImpl, event: EventImpl*/) {
        let calendarId = 1;
         let newEventData: CalEvent = {
             title: event.oldData.title,
             startDate: event.newData.start != null ? event.newData.start.toISOString() : null,
             endDate: event.newData.end != null ? event.newData.end.toISOString() : null,
             fullDay: event.newData.allDay
         }
        this.eventService.update(calendarId, parseInt(event.oldData.id), newEventData).subscribe({
            next: () => {
                this.createInfoMsg(`Evènement -${newEventData.title}- mis à jour`);
            },
            error: (err) => {
                console.log(err)
                event.revert();
            }
        })
    }


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
}
