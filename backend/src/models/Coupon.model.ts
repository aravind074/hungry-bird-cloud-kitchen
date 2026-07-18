import mongoose, { Document, Schema } from 'mongoose';

export type CouponType = 'percentage' | 'flat' | 'free_delivery' | 'bogo';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: CouponType;
  value: number;  // percentage or flat amount
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;  // total uses allowed
  usedCount: number;
  perUserLimit: number;
  usedBy: { userId: mongoose.Types.ObjectId; usedAt: Date }[];
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableFor: 'all' | 'subscription' | 'order';
  applicableCategories: string[];
  applicableItems: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['percentage', 'flat', 'free_delivery', 'bogo'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountAmount: Number,
    usageLimit: { type: Number, default: -1 },  // -1 = unlimited
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    usedBy: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      usedAt: { type: Date, default: Date.now },
    }],
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicableFor: { type: String, enum: ['all', 'subscription', 'order'], default: 'all' },
    applicableCategories: { type: [String], default: [] },
    applicableItems: { type: [Schema.Types.ObjectId], ref: 'MenuItem', default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
