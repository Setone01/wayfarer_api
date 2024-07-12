import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { ConflictError } from "../errors";
import pool from "../config/database.config";
import HttpStatus from "http-status-codes";
import respond from "../utilities/respond.utility";
import { sql } from "../config/sql";
import { Bus } from "../interfaces";
import { JWT } from "src/utilities";

export const BusController = {
  //create register bus

  async createBus(req: Request, res: Response, next: NextFunction) {
    const { plate_number, manufacturer, model, year, capacity } = req.body;
    const user = res.locals.user;
    console.log(user);

    const params = [
      uuidv4(),
      user.id,
      plate_number,
      manufacturer,
      model,
      year,
      capacity,
    ];

    if (!plate_number || !model || !capacity) {
      return next(new ConflictError("Bus info field is required"));
    }

    // if (plate_number || user.id) {
    //   return next(new ConflictError("Bus already existed"));
    // }

    try {
      const { rows } = await pool.query(sql.createBus, params);
      const bus: Bus = rows[0];
      const token = JWT.encode({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      console.log(bus);
      return respond<Bus>(res, bus, HttpStatus.CREATED, null, token);
    } catch (error) {
      return next(new ConflictError(error.message));
    }
  },
};
