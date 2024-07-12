import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "src/config/database.config";
import { ConflictError } from "../errors";
import { sql } from "src/config/sql";
import { respond } from "src/utilities/respond.utility";
import { Trip } from "src/interfaces";
import HttpStatus from "http-status-codes";
import moment from "moment";

export const TripController = {
  //Admin creates trip
  async createTrip(req: Request, res: Response, next: NextFunction) {
    const {
      bus_id,
      origin,
      destination,
      trip_date,
      capacity,
      cost,
      status = "active",
    } = req.body;
    const owner = res.locals.user; // Assuming the user is set by middleware

    if (!owner || owner.role !== "admin") {
      return next(new ConflictError("Admin access required"));
    }

    const values = [
      uuidv4(),
      bus_id,
      owner.id,
      origin,
      destination,
      trip_date,
      capacity,
      cost,
      status,
      moment(new Date()),
      moment(new Date()),
    ];

    try {
      const tripExistsQuery = await pool.query(sql.queryExistingTrip, [
        bus_id,
        origin,
        destination,
        trip_date,
      ]);
      if (tripExistsQuery.rows.length > 0) {
        return next(new ConflictError("Trip already exists"));
      }

      const { rows } = await pool.query(sql.createTrip, values);
      if (rows.length > 0) {
        const trip: Trip = rows[0];
        return respond<Trip>(res, trip, HttpStatus.CREATED);
      } else {
        return next(new ConflictError("Trip creation failed"));
      }
    } catch (error) {
      console.log("SQL Error:", error);
      return next(new ConflictError(`SQL Error: ${error.message}`));
    }
  },

  //admin cancels trips by {id}
  async cancelTrip(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const { rows } = await pool.query(sql.cancelTrip, [id]);
      if (rows.length === 0) {
        return next(new ConflictError("Trip not found or already canceled"));
      }
      const trip: Trip = rows[0];
      return respond<Trip>(res, trip, HttpStatus.OK);
    } catch (error) {
      console.log(error);
      return next(new ConflictError(error.message));
    }
  },
};
