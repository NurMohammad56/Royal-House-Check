import { Plan } from "../model/plan.model.js";

export const getAllPlans = async (_, res, next) => {
    try {
        const plans = await Plan.find({ isActive: true }).sort({ createdAt: -1 });
        return res.status(200).json({
            status: true,
            message: "Plans fetched successfully",
            data: plans
        });
    } catch (error) {
        next(error);
    }
};

export const addPlan = async (req, res, next) => {
    try {
        const { name, monthlyPrice, yearlyPrice, features } = req.body;


        const featuresArray = typeof features === "string" ? features.split(",").map(f => f.trim()) : features;
        // Parse and sanitize prices
        const parsedMonthlyPrice = parseFloat(monthlyPrice.replace(/[^0-9.]/g, ""));
        const parsedYearlyPrice = parseFloat(yearlyPrice.replace(/[^0-9.]/g, ""));

        // Validate yearlyPrice is 25% less than monthlyPrice for a year
        const expectedYearly = +(monthlyPrice * 12 * 0.75).toFixed(2); 
        const givenYearly = +yearlyPrice;

        if (givenYearly !== expectedYearly) {
            return res.status(400).json({
                status: false,
                message: `Yearly price must be 25% discounted compared to monthly price for a year. Expected: ${expectedYearly}`,
            });
        }

        const plan = await Plan.create({
            name,
            monthlyPrice: parsedMonthlyPrice,
            yearlyPrice: parsedYearlyPrice,
            features: featuresArray,
        });

        return res.status(201).json({
            status: true,
            message: "Plan created successfully",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};
export const updatePlan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, monthlyPrice, yearlyPrice, features } = req.body;

        // Parse and sanitize prices
        const parsedMonthlyPrice = parseFloat(monthlyPrice.replace(/[^0-9.]/g, ""));
        const parsedYearlyPrice = parseFloat(yearlyPrice.replace(/[^0-9.]/g, ""));

        // Validate yearlyPrice if updated
        if (parsedMonthlyPrice && parsedYearlyPrice) {
            const calculatedYearlyPrice = parsedMonthlyPrice * 12 * 0.75;
            if (Math.abs(parsedYearlyPrice - calculatedYearlyPrice) > 0.01) {
                return res.status(400).json({
                    status: false,
                    message: "Yearly price must be 25% discounted compared to monthly price for a year.",
                });
            }
        }

        // Process features if provided
        const featuresArray = typeof features === "string" ? features.split(",").map(f => f.trim()) : features;

        // Find and update the plan
        const plan = await Plan.findByIdAndUpdate(id, {
            name,
            monthlyPrice: parsedMonthlyPrice,
            yearlyPrice: parsedYearlyPrice,
            features: featuresArray
        }, { new: true });

        if (!plan) {
            return res.status(404).json({ status: false, message: "Plan not found" });
        }

        return res.status(200).json({
            status: true,
            message: "Plan updated successfully",
            data: plan
        });
    } catch (error) {
        next(error);
    }
};

export const deletePlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByIdAndDelete(id);

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Plan deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const deactivatePlan = async (req, res, next) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findByIdAndUpdate(id, { isActive: false }, { new: true });

        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Plan deactivated successfully"
        });
    } catch (error) {
        next(error);
    }
};

