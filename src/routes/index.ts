import { Router } from "express";
import {
  UserController,
  BusController,
  TripController,
  BookingController,
} from "../controller";
import { authenticate } from "../middleware/authenticate";
import { authoriseAdmin } from "../middleware/authoriseAdmin";
import { authUser } from "../middleware/authUser";

export const router = Router();

//user
router.post(`/auth/signup`, UserController.createUser);
router.post(`/auth/login`, UserController.loginUser);

//bus
router.post(`/bus/register`, authenticate(), BusController.createBus);

//trip
router.post(
  `/trip/create`,
  authenticate(),
  authoriseAdmin(),
  TripController.createTrip
);

router.patch(
  `/trip/cancel-trip/:id`,
  authenticate(),
  authoriseAdmin(),
  TripController.cancelTrip
);

router.get(`/trip/all`, TripController.getAllTrips);

//bookings
router.post(`/trip/booking`, authUser(), TripController.bookSeat);
router.get(`/booking/all`, authenticate(), BookingController.viewAllBookings);
router.delete(
  `/booking/:booking_id`,
  authenticate(),
  BookingController.deleteBooking
);
