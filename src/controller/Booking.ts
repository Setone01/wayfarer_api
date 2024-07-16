import { NextFunction, Request, Response } from "express";
import { respond } from "src/utilities/respond.utility";
import { Booking } from "src/interfaces";
import pool from "src/config/database.config";
import { sql } from "src/config/sql";
import HttpStatus from "http-status-codes";
import { ConflictError } from "src/errors";

export const BookingController = {
  async viewAllBookings(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;
    try {
      let bookings;
      if (user.role === "admin") {
        //Admin can view all bookings
        const { rows } = await pool.query(sql.getAllBookings);
        bookings = rows;
      } else {
        //User can only view their own bookings
        const { rows } = await pool.query(sql.getBookingsByUserId, [user.id]);
        bookings = rows;
      }
      return respond<Booking>(res, bookings, HttpStatus.OK);
    } catch (error) {
      return next(new ConflictError("Failed to get bookings"));
    }
  },

  //User can delete their bookings
  async deleteBooking(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;
    const { booking_id } = req.params;

    try {
      const { rows } = await pool.query(sql.deleteBookings, [
        booking_id,
        user.id,
      ]);
      if (rows.length === 0) {
        return next(new ConflictError("Bookings not found"));
      }

      const deletedBooking = rows[0];
      return respond<Booking>(res, deletedBooking, HttpStatus.OK);
    } catch (error) {
      return next(new ConflictError("An error occured while deleting booking"));
    }
  },
};
