import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true
  },
  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      receiver: { type: Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export const Message = mongoose.model("Message", messageSchema);
