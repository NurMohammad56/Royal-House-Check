import { io } from "../../server.js";
import { Message } from "../model/message.model.js";
// import { io } from "../utils/socket.utils.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    let senderId = req.user.id;
    // console.log(req.user.role);

    let chat = await Message.findOne({ _id: chatId });
    // console.log(chat)
    if (!chat && req.user.role == "client") {
      let check = await Message.findOne({ client: req.user.id });
      if (check) {
        chat = check;
      } else {
        chat = await Message.create({
          client: req.user.id,
          messages: [],
        });
      }
    }

    const newMessage = {
      sender: senderId,
      message,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    io.to(chat._id.toString()).emit("newMessage", newMessage);
    // io.emit("newMessage", newMessage);

    return res.status(201).json({
      status: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatId = async (req, res, next) => {
  try {
    let chat = await Message.findOne({
      client: req.user.id,
    });

    if (!chat) {
      chat = await Message.create({
        client: req.user.id,
        messages: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Chat ID retrieved successfully",
      data: chat._id,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Always find by client (user)
    const chat = await Message.findOne({
      client: userId,
    });

    if (!chat) {
      return res.status(200).json({
        status: true,
        message: "No messages found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Messages retrieved successfully",
      data: chat.messages,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllConversations = async (req, res, next) => {
  try {
    const conversations = await Message.find().populate("client", "name email");

    return res.status(200).json({
      status: true,
      message: "Conversations retrieved successfully",
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// Get all pending message count
export const getPendingMessageCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.receiver": new mongoose.Types.ObjectId(userId),
          "messages.read": false,
        },
      },
      { $count: "count" },
    ]);

    return res.status(200).json({
      status: true,
      message: "Pending message count retrieved successfully",
      data: unreadCount[0]?.count || 0,
    });
  } catch (error) {
    next(error);
  }
};
