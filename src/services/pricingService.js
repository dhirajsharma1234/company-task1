/** @format */

class PricingService {
    constructor() {
        this.baseFares = {
            bike: 50,
            car: 100,
            van: 150,
            truck: 200,
        };

        this.perKmRates = {
            bike: 10,
            car: 15,
            van: 20,
            truck: 25,
        };

        this.weightSurcharges = {
            bike: { base: 100, rate: 5 }, // ₹5 per kg over 10kg
            car: { base: 200, rate: 4 },
            van: { base: 300, rate: 3 },
            truck: { base: 500, rate: 2 },
        };
    }

    calculatePrice(vehicleType, distance, weight) {
        const baseFare = this.baseFares[vehicleType];
        const distanceCharge = distance * this.perKmRates[vehicleType];
        const weightSurcharge = this.calculateWeightSurcharge(
            vehicleType,
            weight
        );

        return baseFare + distanceCharge + weightSurcharge;
    }

    calculateWeightSurcharge(vehicleType, weight) {
        const surchargeConfig = this.weightSurcharges[vehicleType];
        const baseWeight = surchargeConfig.base;

        if (weight <= baseWeight) return 0;

        return (weight - baseWeight) * surchargeConfig.rate;
    }
}

module.exports = PricingService;
