import pool from "../../config/database.config";

const tripTable = `DROP TABLE IF EXISTS trip CASCADE;
CREATE TABLE trip (
    id UUID PRIMARY KEY,
    bus_id UUID REFERENCES bus(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    trip_date DATE NOT NULL,
    capacity INTEGER NOT NULL,
    cost DECIMAL(10, 2) CHECK (cost >= 0) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export async function createTripTable(): Promise<void> {
  try {
    const create = await pool.query(tripTable);
    console.log(`tripTable: ${create[0].command}PED and ${create[1].command}D`);
  } catch (error) {
    console.log(`tripTable: ${error}`);
  }
}
