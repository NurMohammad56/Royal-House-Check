import mongoose, { Schema } from "mongoose";

const addsOnServiceSchema = new Schema(
  {
    name: {
      type: String,
    },
    flexiblePrice: {
      type: Number,
    },
    tieredPrice: {
      type: Number,
    },
    pack: {
      type: String,
      enum: ["weekly", "monthly", "daily", "per-patrol", "incident", "visit"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const AddsOnService = mongoose.model(
  "AddsOnService",
  addsOnServiceSchema
);
