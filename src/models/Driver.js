/** @format */

const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        vehicleType: {
            type: String,
            enum: ["bike", "car", "truck", "van"],
            required: true,
        },
        licenseNo: {
            type: String,
            required: true,
            unique: true,
        },
        vehicleNo: String,
        isAvailable: {
            type: Boolean,
            default: true,
        },
        currentLocation: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

driverSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Driver", driverSchema);
