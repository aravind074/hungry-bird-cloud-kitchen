import mongoose, { Document, Schema } from 'mongoose';

export type SubscriptionPlan = 'breakfast' | 'lunch' | 'dinner' | 'full_day';
export type SubscriptionDuration = 15 | 30 | 90;
export type SubscriptionStatus = 'active' | 'paused' | 'expired' | 'cancelled' | 'pending_payment';

export interface IMealScheduleEntry {
  date: Date;
  menuItemId?: mongoose.Types.ObjectId;
  mealName?: string;
  status: 'scheduled' | 'preparing' | 'prepared' | 'delivered' | 'skipped' | 'missed';
  orderId?: mongoose.Types.ObjectId;
  deliveredAt?: Date;
  skippedAt?: Date;
  skipReason?: string;
}

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  subscriptionId: string;
  userId: mongoose.Types.ObjectId;
  plan: SubscriptionPlan;
  duration: SubscriptionDuration;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  deliverySlot: {
    breakfast?: string;  // e.g. "08:00-09:00"
    lunch?: string;      // e.g. "12:30-13:30"
    dinner?: string;     // e.g. "19:00-20:00"
  };
  dietaryPreferences: string[];
  allergies: string[];
  mealSchedule: IMealScheduleEntry[];
  pausedDays: Date[];
  maxPauseDays: number;
  pausedDaysUsed: number;
  autoRenew: boolean;
  pricing: {
    pricePerDay: number;
    totalPrice: number;
    discount: number;
    finalPrice: number;
  };
  payment: {
    method: string;
    transactionId?: string;
    paidAt?: Date;
  };
  renewalHistory: {
    renewedAt: Date;
    duration: number;
    amount: number;
    transactionId: string;
  }[];
  renewalReminderSentAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mealScheduleSchema = new Schema<IMealScheduleEntry>({
  date: { type: Date, required: true },
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
  mealName: String,
  status: {
    type: String,
    enum: ['scheduled', 'preparing', 'prepared', 'delivered', 'skipped', 'missed'],
    default: 'scheduled',
  },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  deliveredAt: Date,
  skippedAt: Date,
  skipReason: String,
}, { _id: true });

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriptionId: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'full_day'],
      required: true,
    },
    duration: {
      type: Number,
      enum: [15, 30, 90],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'paused', 'expired', 'cancelled', 'pending_payment'],
      default: 'pending_payment',
      index: true,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      lat: Number,
      lng: Number,
    },
    deliverySlot: {
      breakfast: String,
      lunch: String,
      dinner: String,
    },
    dietaryPreferences: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    mealSchedule: { type: [mealScheduleSchema], default: [] },
    pausedDays: { type: [Date], default: [] },
    maxPauseDays: { type: Number, default: 3 },
    pausedDaysUsed: { type: Number, default: 0 },
    autoRenew: { type: Boolean, default: true },
    pricing: {
      pricePerDay: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      finalPrice: { type: Number, required: true },
    },
    payment: {
      method: String,
      transactionId: String,
      paidAt: Date,
    },
    renewalHistory: [{
      renewedAt: Date,
      duration: Number,
      amount: Number,
      transactionId: String,
    }],
    renewalReminderSentAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

subscriptionSchema.pre('save', function (next) {
  if (!this.subscriptionId) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.subscriptionId = `SUB-${random}`;
  }
  next();
});

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });
subscriptionSchema.index({ 'mealSchedule.date': 1, 'mealSchedule.status': 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema);
