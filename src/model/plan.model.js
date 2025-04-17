import mongoose, { Schema } from "mongoose";

const planSchema = new Schema({

    clientId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
    },

    endDate: {
        type: Date,
    },

    addOnServices: [{
        addOn: {
            type: String
        },
        price: {
            type: Number
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        }
    }]

}, { timestamps: true });

export const Plan = mongoose.model("Plan", planSchema);