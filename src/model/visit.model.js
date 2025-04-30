import mongoose, { Schema } from "mongoose";

const visitSchema = new Schema({
    visitId: {
        type: String,
        unique: true,
        trim: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    address: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["completed", "cancelled", "confirmed", "pending"],
        default: 'pending'
    },
    cancellationReason: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['routine check', "emergency", 'follow up']
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    },
    issues: [{
        place: {
            type: String,
            trim: true
        },
        issue: {
            type: String,
            trim: true
        },
        issueDate: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
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
    }],
    isPaid: {
        type: Boolean,
        default: false
    },
    plan: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
    },
    addsOnService: {
        type: Schema.Types.ObjectId,
        ref: 'AddsOnService'
    }

}, { timestamps: true })

// Pre-save hook to generate visitId
visitSchema.pre('save', async function(next) {
    if (!this.visitId) {
        let isUnique = false;
        let generatedId;
        
        while (!isUnique) {
            // Generate a 6-digit random number
            generatedId = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Check if this ID already exists
            const existingVisit = await this.constructor.findOne({ visitId: generatedId });
            if (!existingVisit) {
                isUnique = true;
            }
        }
        
        this.visitId = generatedId;
    }
    next();
});

export const Visit = mongoose.model("Visit", visitSchema);