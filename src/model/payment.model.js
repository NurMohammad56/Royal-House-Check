import mongoose, {Schema} from 'mongoose';

const paymentSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: Number,
  date: Date,
  status: { type: String, enum: ['paid', 'failed', 'pending'], default: 'pending' },
  method: String,
  subscriptionPlan: String,
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
