// models/message.model.ts
import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Only one conversation per user
  },
  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      message: { type: String, required: true },
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export const Message = mongoose.model("Message", messageSchema);
