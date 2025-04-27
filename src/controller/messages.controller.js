import { Message } from "../model/message.model.js";
import { io } from "../utils/socket.utils.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user.id;

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

        const newMessage = {
            sender: senderId,
            receiver: receiverId,
            message,
            createdAt: new Date()
        };

        chat.messages.push(newMessage);
        await chat.save();

        // Emit real-time message to the receiver's room
        io.to(receiverId).emit("newMessage", newMessage);


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
        });

        if (!chat) {
            return res.status(200).json({
                status: true,
                message: "No messages found",
                data: []
            });
        }

        return res.status(200).json({
            status: true,
            message: "Messages retrieved successfully",
            data: chat.messages
        });
    } catch (error) {
        next(error);
    }
};

// Get all pending message count
export const getPendingMessageCount = async (req, res, next) => {
    try {
        const count = await Message.countDocuments({
            $or: [
                { client: req.user.id, "messages.read": false },
                { staff: req.user.id, "messages.read": false }
            ]
        });
        return res.status(200).json({
            status: true,
            message: "Pending message count retrieved successfully",
            data: count
        });
    } catch (error) {
        next(error);
    }
};
