export interface CalEvent {
    id?:number;
    title: string;
    startDate: string | null;
    endDate: string | null;
    fullDay: boolean;
}
