/** @format */

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
        },
        pickupLocation: {
            address: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        dropoffLocation: {
            address: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        vehicleType: {
            type: String,
            enum: ["bike", "car", "truck", "van"],
            required: true,
        },
        weight: {
            type: Number,
            required: true,
        },
        distance: Number, // in km
        price: Number,
        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "in_progress",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },
        bookingId: {
            type: String,
            unique: true,
        },
        estimatedPrice: Number,
        finalPrice: Number,
    },
    {
        timestamps: true,
    }
);

bookingSchema.pre("save", function (next) {
    if (!this.bookingId) {
        this.bookingId = "BK" + Date.now();
    }
    next();
});

module.exports = mongoose.model("Booking", bookingSchema);
