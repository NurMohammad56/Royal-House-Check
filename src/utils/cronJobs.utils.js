import cron from "node-cron";
import { User } from "../model/user.model.js";

const updateUserStatuses = async () => {
    const now = Date.now();
    const inactiveThreshold = 10 * 60 * 1000;
    const activeThreshold = 5 * 60 * 1000;

    try {
        // Mark inactive users (no sessionEndTime + inactive > 10 mins)
        const inactiveFilter = {
            lastActive: { $lt: new Date(now - inactiveThreshold) },
            "sessions.sessionEndTime": { $exists: false },
            status: "active"
        };

        const inactiveUsers = await User.find(inactiveFilter);

        if (inactiveUsers.length > 0) {
            await User.updateMany(
                inactiveFilter,
                {
                    $set: { status: "inactive" },
                    $push: {
                        sessions: {
                            sessionStartTime: new Date(now - inactiveThreshold),
                            sessionEndTime: new Date(now)
                        }
                    }
                }
            );
        }

        // Mark active users (lastActive within last 5 mins)
        const activeUsers = await User.find({
            lastActive: { $gte: new Date(now - activeThreshold) },
            status: { $ne: "active" }
        });

        if (activeUsers.length > 0) {
            const updates = activeUsers.map(user =>
                User.findByIdAndUpdate(user._id, {
                    $set: { status: "active" }
                })
            );
            await Promise.all(updates);
        }

        console.log(`Cron Ran: ${inactiveUsers.length} inactive, ${activeUsers.length} active.`);
    } catch (error) {
        console.error("Error updating user statuses:", error);
    }
};

// Schedule the cron job to run every 5 minutes
const startCronJob = () => {
    cron.schedule("*/5 * * * *", () => {
        console.log("Running updateUserStatuses cron job...");
        updateUserStatuses();
    });

    console.log("node-cron scheduled to run every 5 minutes.");
};

export { startCronJob };
