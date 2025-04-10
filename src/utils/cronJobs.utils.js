import cron from "node-cron";
import { User } from "../model/user.model.js";

const updateUserStatuses = async () => {
    const inactiveThreshold = 10 * 60 * 1000; // 10 minutes (inactive user threshold)
    const activeThreshold = 5 * 60 * 1000; // 5 minutes (active user threshold)

    try {
        // Fetch all users who are inactive (lastActive > 10 minutes ago and no sessionEndTime)
        const inactiveUsers = await User.find({
            lastActive: { $lt: new Date(Date.now() - inactiveThreshold) },
            "sessions.sessionEndTime": { $exists: false },
        });

        // Mark inactive users as inactive by setting sessionEndTime
        if (inactiveUsers.length > 0) {
            const updates = inactiveUsers.map((user) =>
                User.findByIdAndUpdate(
                    user._id,
                    {
                        $set: {
                            "sessions.$[elem].sessionEndTime": new Date(),
                            status: "inactive", // Update status to inactive
                        },
                    },
                    {
                        arrayFilters: [{ "elem.sessionEndTime": { $exists: false } }],
                    }
                )
            );
            await Promise.all(updates);
        }

        // Fetch all users who are active (lastActive <= 5 minutes ago)
        const activeUsers = await User.find({
            lastActive: { $gte: new Date(Date.now() - activeThreshold) },
        });

        // Update status to "active" for active users (if not already active)
        if (activeUsers.length > 0) {
            const updates = activeUsers.map((user) =>
                User.findByIdAndUpdate(user._id, {
                    $set: { status: "active" }, // Update status to active
                })
            );
            await Promise.all(updates);
        }

        console.log(`Checked and updated statuses: ${inactiveUsers.length} inactive, ${activeUsers.length} active.`);
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

    console.log("node-cron job scheduled to run every 5 minutes.");
};

export { startCronJob };
