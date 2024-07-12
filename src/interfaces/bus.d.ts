export interface Bus {
  id: string;
  owner_id: string;
  plate_number: string;
  manufacturer: string;
  model: string;
  year: string;
  capacity: number;
  created_date?: Date;
  updated_date?: Date;
}
