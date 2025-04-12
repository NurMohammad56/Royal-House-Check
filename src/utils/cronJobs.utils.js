import cron from "node-cron";
import { User } from "../model/user.model.js";

const INACTIVITY_THRESHOLD = 10 * 60 * 1000; // 10 mins in milliseconds

export const checkInactiveUsers = async () => {
    const now = new Date();
    const cutoffTime = new Date(now - INACTIVITY_THRESHOLD);

    // Find active users who were last seen >10 mins ago
    const inactiveUsers = await User.find({
        status: "active",
        lastActive: { $lt: cutoffTime }, // Older than 10 mins
    });

    // Mark them inactive + close sessions
    for (const user of inactiveUsers) {
        const openSession = user.sessions.find(s => !s.sessionEndTime);
        if (openSession) {
            openSession.sessionEndTime = now;
        }
        user.status = "inactive";
        await user.save();
    }

    console.log(`[CRON] Marked ${inactiveUsers.length} users as inactive.`);
};

// Run every 5 minutes (for better accuracy)
cron.schedule("*/5 * * * *", checkInactiveUsers);