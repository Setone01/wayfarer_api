import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { sql } from "../config/sql";
import HttpStatus from "http-status-codes";
import { BadRequestError, ConflictError } from "../errors";
import { hashPassword, isValidEmail } from "../utilities/password.utility";
import respond from "../utilities/respond.utility";
import { JWT } from "../utilities";
import pool from "../config/database.config";
import { User } from "../interfaces";
import { compareSync } from "bcrypt";

export const UserController = {
  //create user
  async createUser(req: Request, res: Response, next: NextFunction) {
    const { first_name, last_name, email, password, role } = req.body;

    if (!first_name || !last_name || !email || !password || !role) {
      return next(new BadRequestError("Missing required fields"));
    }

    if (!isValidEmail(email)) {
      return next(new BadRequestError("Invalid email format"));
    }

    const params = [
      uuidv4(),
      first_name,
      last_name,
      email,
      hashPassword(password),
      role,
    ];

    try {
      const userExist = await pool.query(sql.findSingleUser, [email]);

      if (userExist.rows.length > 0) {
        return next(new BadRequestError("User already exists"));
      }

      if (!["admin", "user"].includes(role)) {
        return next(new ConflictError("Invalid role"));
      }

      const { rows } = await pool.query(sql.createUser, params);
      if (rows.length > 0) {
        const user: User = rows[0];
        const token = JWT.encode({
          id: user.id,
          email: user.email,
        });
        console.log("create user", token);
        return respond<User>(res, user, HttpStatus.CREATED, null, token);
      } else {
        return next(new ConflictError("User creation failed"));
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return next(
        new ConflictError("An error occurred while creating the user")
      );
    }
  },

  //user login

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    const params = [email];

    if (!email || !isValidEmail(email)) {
      return next(new BadRequestError("Missing or invalid"));
    }

    if (!password) {
      return next(new BadRequestError("Password password"));
    }

    try {
      const { rows } = await pool.query(sql.queryUserByEmail, params);
      if (rows) {
        if (rows[0]) {
          const user: User = rows[0];
          const comparePassword = compareSync(req.body.password, user.password);
          if (comparePassword) {
            //remove neccessary users sensitve info from token
            const token = JWT.encode({
              id: user.id,
              email: user.email,
            });
            console.log("log in", token);
            return respond<User>(res, user, HttpStatus.OK, null, token);
          }
          if (!comparePassword) {
            return next(new ConflictError("Invalid password"));
          }
        }
      }
    } catch (error) {
      return next(new ConflictError("Error creating user:", error));
    }
  },
};

export default UserController;
