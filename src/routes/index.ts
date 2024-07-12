import { Router } from "express";
import { UserController, BusController, TripController } from "../controller";
import { authenticate } from "../middleware/authenticate";
import { authoriseAdmin } from "../middleware/authoriseAdmin";

// const { createUser, loginUser } = UserController;
// const { createBus } = BusController;

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
