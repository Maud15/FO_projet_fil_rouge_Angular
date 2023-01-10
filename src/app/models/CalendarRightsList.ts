//TODO: Modifier ce modèle pour qu'il corresponde à celui d'un CalendarRightsList (en back-end)
export interface CalendarRightsList{

    'calendars': [
        {
            "userCalendarRightsId": {
                "userId": number,
                "calendarId": number
            },
            "rights": String
        }
    ]
}
