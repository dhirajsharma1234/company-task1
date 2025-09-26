/** @format */

const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Driver = require("../models/Driver");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            phone,
            vehicleType,
            licenseNo,
            vehicleNo,
        } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
        });

        // If driver, create driver profile
        if (role === "driver") {
            await Driver.create({
                user: user._id,
                vehicleType,
                licenseNo,
                vehicleNo,
            });
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.correctPassword(password, user.password))) {
            let driverProfile = null;

            if (user.role === "driver") {
                driverProfile = await Driver.findOne({ user: user._id });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                driverProfile,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
