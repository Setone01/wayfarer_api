import pg from "pg";
import pool from "../config/database.config";

export default {
  /**
   * DB Abstraction
   * @param {string} text
   * @param {string} params
   *
   */

  async query(text: string, params?: any): Promise<pg.QueryResult> {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.log(`DB: ${error.message}`);
      return error;
    }
  },
};
