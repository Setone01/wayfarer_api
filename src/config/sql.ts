import { query } from "express";

export const sql = {
  createUser: `INSERT INTO users (id, first_name, last_name, email, password, role) values ($1, $2, $3, $4, $5, $6) returning *`,
  findSingleUser: `SELECT id, email, password, role FROM users WHERE email || id LIKE $1`,
  queryUserByEmail: `SELECT * FROM  users WHERE email = $1 `,
  createBus: `INSERT INTO bus (id, owner_id, plate_number, manufacturer, model, year, capacity) values($1, $2, $3, $4, $5, $6, $7) returning *`,
  createTrip: `INSERT INTO trip (id, bus_id, admin_id, origin, destination, trip_date, capacity, cost, status, created_at, updated_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *`,
  queryExistingTrip: `
    SELECT * FROM trip
    WHERE bus_id = $1
    AND origin = $2
    AND destination = $3
    AND trip_date = $4
  `,
  cancelTrip: `UPDATE trip SET status = 'canceled' WHERE id = $1 returning *`,
};
