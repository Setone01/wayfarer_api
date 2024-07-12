import { createUsersTable } from "../models";
import { createBusTable } from "../models";
import { createTripTable } from "../models";
import { createBookingTable } from "../models";

(async () => {
  try {
    await createUsersTable();
    await createBusTable();
    await createTripTable();
    await createBookingTable();
  } catch (error) {
    console.log(`Error in migration ${error}`);
  }
})();
