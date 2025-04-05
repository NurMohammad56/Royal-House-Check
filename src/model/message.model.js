import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({

    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        message: {
            type: String,
            trim: true
        },
    }]
})

export const Message = mongoose.model("Message", messageSchema)