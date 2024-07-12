import bcrypt from "bcrypt";
import dotenv from "dotenv";
import variables from "../variables";

dotenv.config();

/**
 * Hash Password Method
 * @param {string} password
 * @returns {string} returns hashed password
 */

export const hashPassword = (password: string): string =>
  bcrypt.hashSync(password, variables.auth.jwtSaltRounds);

/**
 * Compare Password Method
 * @param {string} password
 * @param {string} hashPassword
 */

export const comparePassword = (
  password: string,
  hashPassword: string
): boolean => bcrypt.compareSync(password, hashPassword);
