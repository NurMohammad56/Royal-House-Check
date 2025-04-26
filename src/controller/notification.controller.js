import { Notification } from "../model/notfication.model.js";

// User
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

// Admin
export const getAdminNotifications = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "userId",
                select: "fullname email role",
                match: { role: { $ne: "admin" } }
            })
            .populate({
                path: "relatedEntity",
                model: "Payment",
                populate: {
                    path: "user plan",
                    select: "fullname email name"
                }
            });

        const formattedNotifications = notifications.map(notification => {
            // For admin notifications, show the payment user's info
            const paymentUser = notification.relatedEntity?.user;
            const paymentPlan = notification.relatedEntity?.plan;

            return {
                ...notification.toObject(),
                displayUser: paymentUser || notification.userId,
                plan: paymentPlan
            };
        });

        const total = await Notification.countDocuments();

        return res.json({
            success: true,
            data: formattedNotifications,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Mark notification as read
export const markAdminNotificationAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        // Mark the notification as read by updating isRead field
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

// Admin: Delete a notification
export const deleteAdminNotification = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        // Delete the notification by its ID
        const deleted = await Notification.findByIdAndDelete(notificationId);

        if (!deleted) {
            return res.status(404).json({ status: false, message: "Notification not found" });
        }

        return res.status(200).json({ status: true, message: "Notification deleted successfully" });
    } catch (error) {
        next(error);
    }
};