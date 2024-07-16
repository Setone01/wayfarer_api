import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import pool from "src/config/database.config";
import { ConflictError } from "../errors";
import { sql } from "src/config/sql";
import { respond } from "src/utilities/respond.utility";
import { Booking, Trip } from "src/interfaces";
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
      cost,
      status = "active",
    } = req.body;
    const admin_id = res.locals.user; // Assuming the user is set by middleware

    try {
      //to check for the availability of bus
      const busQuery = await pool.query(sql.queryBusById, [bus_id]);
      if (busQuery.rows.length === 0) {
        return next(new ConflictError("Bus not found"));
      }

      //getting the exact seat capacity of every register bus
      const bus = busQuery.rows[0];
      const capacity = bus.capacity;

      const values = [
        uuidv4(),
        bus_id,
        admin_id,
        origin,
        destination,
        moment(trip_date).format("YYYY-MM-DD HH:mm:ss"),
        capacity,
        cost,
        status,
      ];

      //check if trip already exists for the given bus, origin, destination, and trip_date

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



  //user booking a seat on trip
  async bookSeat(req: Request, res: Response, next: NextFunction) {
    const { trip_id } = req.params;
    const user_id = res.locals.user; // Assuming the user is set by middleware

    try {
      const tripQuery = await pool.query(sql.queryTripById, [trip_id]);
      if (tripQuery.rows.length === 0) {
        return next(new ConflictError("Trip not found"));
      }

      const trip = tripQuery.rows[0];

      if (trip.status === "cancelled") {
        return next(new ConflictError("Trip is cancelled"));
      }

      // check if trip is full
      const countBookings = await pool.query(sql.countBookingsOnTrip, [
        trip_id,
      ]);
      const currentBooking = parseInt(countBookings.rows[0].count, 10);
      if (currentBooking >= trip.capacity) {
        return next(new ConflictError("Trip is fully booked"));
      }

      //find the next available booking seat number
      const bookedSeatQuery = await pool.query(sql.getAvailableSeatNumber, [
        trip_id,
      ]);
      const bookedSeatNumber = bookedSeatQuery.rows.map(
        (row) => row.seat_number
      );
      const availableSeat = [...Array(trip.capacity).keys()]
        .map((i) => i + 1)
        .find((seats) => !bookedSeatNumber.includes(seats));

      const value = [uuidv4(), user_id, trip_id, availableSeat];

      const { rows } = await pool.query(sql.createBooking, value);
      if (rows.length === 0) {
        const booking = rows[0];
        return respond<Booking>(res, booking, HttpStatus.CREATED);
      }
    } catch (error) {
      console.log(error);
      return next(new ConflictError(error.message));
    }
  },

  //view all trip
  async getAllTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const { rows } = await pool.query(sql.queryAllTrip);
      return respond<Trip[]>(res, rows, HttpStatus.OK);
    } catch (error) {
      console.log(error);
      return next(new ConflictError(error.message));
    }
  },
};
