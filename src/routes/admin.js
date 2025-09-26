/** @format */

const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
    getAllBookings,
    assignDriver,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/bookings", auth, authorize("admin"), getAllBookings);
router.patch(
    "/bookings/:bookingId/assign-driver",
    auth,
    authorize("admin"),
    assignDriver
);

module.exports = router;
