/** @format */

const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const {
    createBooking,
    getAvailableBookings,
    acceptBooking,
    updateBookingStatus,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", auth, authorize("customer"), createBooking);
router.get("/available", auth, authorize("driver"), getAvailableBookings);
router.patch("/:bookingId/accept", auth, authorize("driver"), acceptBooking);
router.patch("/:bookingId/status", auth, updateBookingStatus);

module.exports = router;
