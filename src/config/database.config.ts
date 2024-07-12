import pg from "pg";
import dotenv from "dotenv";
import variables from "../variables";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: variables.app.dbUrl,
});

pool.on(`connect`, () => {
  console.log("connected to the db");
});

export default pool;
