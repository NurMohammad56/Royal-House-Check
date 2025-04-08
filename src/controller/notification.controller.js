import { Notification } from "../model/notfication.model.js";

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate("userId");

        return res.status(200).json({
            status: true,
            message: " Notifications fetched successfully",
            data: notifications
        });

    } catch (error) {
        next(error);
    }
};

export const markNotificationAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        const updated = await Notification.findByIdAndUpdate(
            notificationId,
            { isRead: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ status: false, message: "Notification not found" });
        }

        return res.status(200).json({ status: true, message: "Notification marked as read" });

    } catch (error) {
        next(error);
    }
};

// Delete a notification
export const deleteNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        const deleted = await Notification.findByIdAndDelete(notificationId);

        if (!deleted) {
            return res.status(404).json({ status: false, message: "Notification not found" });
        }

        return res.status(200).json({ status: true, message: "Notification deleted successfully" });

    } catch (error) {
        next(error);
    }
};
