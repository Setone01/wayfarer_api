export interface Trip {
    id?: string;
    bus_id: string;
    origin: string;
    destination: string;
    departure_time: Date;
    fare: number;
    status: string;
    created_date?: Date;
    updated_date?: Date;
}