import db from "../database/query";
import { sql } from "../config/sql";
import type { User } from "../interfaces";

export const createUser = async (filters: Partial<User>): Promise<User> => {
  const newUser = await db.query(sql.createUser, filters);
  return newUser.rows[0];
};

export const findUser = async (filters: Partial<User>): Promise<User> => {
  const user = await db.query(sql.findSingleUser, filters);
  return user.rows[0];
};
