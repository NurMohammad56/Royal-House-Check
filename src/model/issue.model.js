import mongoose, { Schema } from "mongoose";

const issueSchema = new Schema({
    visitId: {
        type: Schema.Types.ObjectId,
        ref: 'Visit',
        required: true
    },
    isFounded: {
        type: Boolean,
        default: false
    },
    issues: [{
        issue: {
            type: String,
            trim: true
        },
        type: {
            type: String,
            enum: ["warning", "red alert"]
        },
        media: [{
            type: {
                type: String,
                enum: ["photo", "video"]
            },
            url: {
                type: String,
                trim: true
            }
        }],
        notes: {
            type: String,
            trim: true
        }
    }]
})

export const Issue = mongoose.model("Issue", issueSchema);