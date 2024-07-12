import pool from "../../config/database.config";

const bookingTable = `DROP TABLE IF EXISTS booking CASCADE;
CREATE TABLE booking (
    id UUID PRIMARY KEY,
    trip_id UUID REFERENCES trip(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export async function createBookingTable(): Promise<void> {
  try {
    const create = await pool.query(bookingTable);
    console.log(
      `bookingTable: ${create[0].command}PED and ${create[1].command}D`
    );
  } catch (error) {
    console.log(`bookingTable: ${error}`);
  }
}
