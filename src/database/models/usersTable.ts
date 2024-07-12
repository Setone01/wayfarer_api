import pool from "../../config/database.config";

const usersTable = `DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

export async function createUsersTable(): Promise<void> {
  try {
    const create = await pool.query(usersTable);
    console.log(
      `usersTable: ${create[0].command}PED and ${create[1].command}D`
    );
  } catch (error) {
    console.log(`usersTable: ${error}`);
  }
}
