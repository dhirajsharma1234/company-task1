/** @format */

const axios = require("axios");

class MapsService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl =
            "https://maps.googleapis.com/maps/api/distancematrix/json";
    }

    async calculateDistance(origin, destination) {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    origins: origin,
                    destinations: destination,
                    key: this.apiKey,
                },
            });

            if (response.data.status === "OK") {
                const element = response.data.rows[0].elements[0];
                if (element.status === "OK") {
                    return {
                        distance: element.distance.value / 1000, // Convert to km
                        duration: element.duration.text,
                    };
                }
            }

            throw new Error("Unable to calculate distance");
        } catch (error) {
            console.error("Maps API Error:", error);
            // Fallback: Use approximate distance calculation
            return this.calculateApproximateDistance(origin, destination);
        }
    }

    calculateApproximateDistance(origin, destination) {
        // Simple haversine formula implementation as fallback
        const [lat1, lng1] = origin.split(",").map(Number);
        const [lat2, lng2] = destination.split(",").map(Number);

        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
            distance: Math.round(distance * 100) / 100,
            duration: "Approximate calculation",
        };
    }
}

module.exports = MapsService;
