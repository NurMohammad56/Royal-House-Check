import cron from "node-cron";
import { User } from "../model/user.model.js";

const checkInactiveUsers = async () => {
  const inactiveThreshold = 10 * 60 * 1000; 

  try {
    const inactiveUsers = await User.find({
      lastActive: { $lt: new Date(Date.now() - inactiveThreshold) },
      "sessions.sessionEndTime": { $exists: false },
    });

    if (inactiveUsers.length > 0) {
      const updates = inactiveUsers.map((user) =>
        User.findByIdAndUpdate(
          user._id,
          {
            $set: {
              "sessions.$[elem].sessionEndTime": new Date(),
            },
          },
          {
            arrayFilters: [{ "elem.sessionEndTime": { $exists: false } }],
          }
        )
      );

      await Promise.all(updates);
    }
  } catch (error) {
    console.error("Error checking inactive users:", error);
  }
};

const startCronJob = () => {
  cron.schedule("*/5 * * * *", () => {
    console.log("Running checkInactiveUsers cron job...");
    checkInactiveUsers();
  });

  console.log("node-cron job scheduled to run every 5 minutes.");
};

export { startCronJob };
