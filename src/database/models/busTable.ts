import pool from "../../config/database.config";

const busTable = `DROP TABLE IF EXISTS bus CASCADE;
CREATE TABLE bus (
    id UUID PRIMARY KEY,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plate_number VARCHAR (255) NOT NULL, 
    manufacturer VARCHAR (255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    capacity INTEGER UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export async function createBusTable(): Promise<void> {
  try {
    const create = await pool.query(busTable);
    console.log(`busTable: ${create[0].command}PED and ${create[1].command}D`);
  } catch (error) {
    console.log(`busTable: ${error}`);
  }
}
