import { Message } from "../model/message.model.js";
import { Notification } from "../model/notification.model.js";
import { io } from "../utils/socket.utils.js";


export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

        // Check if conversation exists between client and staff
        let chat = await Message.findOne({
            $or: [
                { client: senderId, staff: receiverId },
                { client: receiverId, staff: senderId }
            ]
        });

        if (!chat) {
            chat = await Message.create({
                client: senderId,
                staff: receiverId,
                messages: []
            });
        }

        // Push new message into the messages array
        const newMessage = {
            sender: senderId,
            receiver: receiverId,
            message
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Emit real-time message
        io.to(receiverId).emit("newMessage", {
            sender: senderId,
            message,
            createdAt: newMessage.createdAt
        });

        // Create notification for the receiver
        await Notification.create({
            userId: receiverId,
            notifications: [{
                type: "new message",
                message: `New message from ${senderId}`,
                isRead: false,
            }]
        });

        return res.status(201).json({
            status: true,
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const chat = await Message.findOne({
            $or: [
                { client: req.user.id, staff: userId },
                { client: userId, staff: req.user.id }
            ]
        }).populate("messages.sender messages.receiver", "name email");

        if (!chat) {
            return res.status(200).json({ success: true, data: [] });
        }

        res.status(200).json({ success: true, data: chat.messages });
    } catch (error) {
        next(error);
    }
};
