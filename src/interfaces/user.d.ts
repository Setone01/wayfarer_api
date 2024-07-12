export interface User {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  created_date?: Date;
  updated_date?: Date;
}
