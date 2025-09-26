/** @format */

const Booking = require("../models/Booking");
const Driver = require("../models/Driver");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer", "name email phone")
            .populate("driver", "vehicleType licenseNo")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.assignDriver = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { driverId } = req.body;

        const booking = await Booking.findOne({ bookingId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        if (booking.vehicleType !== driver.vehicleType) {
            return res.status(400).json({ message: "Vehicle type mismatch" });
        }

        booking.driver = driverId;
        booking.status = "accepted";
        await booking.save();

        driver.isAvailable = false;
        await driver.save();

        res.json({ message: "Driver assigned successfully", booking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
