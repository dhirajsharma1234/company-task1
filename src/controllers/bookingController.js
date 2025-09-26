/** @format */

const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const MapsService = require("../services/mapsService");
const PricingService = require("../services/pricingService");

const mapsService = new MapsService(process.env.GOOGLE_MAPS_API_KEY);
const pricingService = new PricingService();

exports.createBooking = async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, vehicleType, weight } =
            req.body;

        // Calculate distance
        const origin = `${pickupLocation.coordinates.lat},${pickupLocation.coordinates.lng}`;
        const destination = `${dropoffLocation.coordinates.lat},${dropoffLocation.coordinates.lng}`;

        const distanceInfo = await mapsService.calculateDistance(
            origin,
            destination
        );

        // Calculate price
        const estimatedPrice = pricingService.calculatePrice(
            vehicleType,
            distanceInfo.distance,
            weight
        );

        const booking = await Booking.create({
            customer: req.user._id,
            pickupLocation,
            dropoffLocation,
            vehicleType,
            weight,
            distance: distanceInfo.distance,
            estimatedPrice,
        });

        res.status(201).json({
            bookingId: booking.bookingId,
            estimatedPrice: booking.estimatedPrice,
            distance: booking.distance,
            status: booking.status,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAvailableBookings = async (req, res) => {
    try {
        const driver = await Driver.findOne({ user: req.user._id });

        const bookings = await Booking.find({
            vehicleType: driver.vehicleType,
            status: "pending",
            driver: { $exists: false },
        }).populate("customer", "name phone");

        res.json(bookings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.acceptBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findOne({ bookingId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== "pending") {
            return res
                .status(400)
                .json({ message: "Booking already accepted" });
        }

        const driver = await Driver.findOne({ user: req.user._id });

        booking.driver = driver._id;
        booking.status = "accepted";
        await booking.save();

        // Update driver availability
        driver.isAvailable = false;
        await driver.save();

        res.json({ message: "Booking accepted successfully", booking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const booking = await Booking.findOne({ bookingId });
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;

        if (status === "completed") {
            booking.finalPrice = booking.estimatedPrice;

            // Make driver available again
            await Driver.findByIdAndUpdate(booking.driver, {
                isAvailable: true,
            });
        }

        await booking.save();

        res.json({ message: "Booking status updated successfully", booking });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
