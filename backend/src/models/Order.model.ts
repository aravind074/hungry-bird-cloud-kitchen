import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'stripe' | 'cod' | 'wallet';
export type OrderType = 'delivery' | 'pickup' | 'subscription';

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  customizations?: { name: string; option: string; price: number }[];
  specialInstructions?: string;
  subtotal: number;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: string;
  userId: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  items: IOrderItem[];
  orderType: OrderType;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: Date; note?: string }[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
  };
  kitchenNotes?: string;
  deliveryPartnerId?: mongoose.Types.ObjectId;
  deliveryOtp?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  pricing: {
    subtotal: number;
    deliveryFee: number;
    packagingFee: number;
    discount: number;
    gst: number;
    total: number;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    razorpayOrderId?: string;
    stripePaymentIntentId?: string;
    paidAt?: Date;
    refundedAt?: Date;
    refundAmount?: number;
  };
  couponCode?: string;
  couponDiscount?: number;
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  isRated: boolean;
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  thumbnail: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  customizations: [{
    name: String,
    option: String,
    price: { type: Number, default: 0 },
  }],
  specialInstructions: String,
  subtotal: { type: Number, required: true },
}, { _id: false });

const orderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    items: { type: [orderItemSchema], required: true },
    orderType: {
      type: String,
      enum: ['delivery', 'pickup', 'subscription'],
      default: 'delivery',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true,
    },
    statusHistory: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String,
    }],
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      lat: Number,
      lng: Number,
    },
    kitchenNotes: String,
    deliveryPartnerId: { type: Schema.Types.ObjectId, ref: 'User' },
    deliveryOtp: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    pricing: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, default: 0 },
      packagingFee: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      gst: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    payment: {
      method: {
        type: String,
        enum: ['razorpay', 'stripe', 'cod', 'wallet'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      transactionId: String,
      razorpayOrderId: String,
      stripePaymentIntentId: String,
      paidAt: Date,
      refundedAt: Date,
      refundAmount: Number,
    },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    loyaltyPointsUsed: { type: Number, default: 0 },
    loyaltyPointsEarned: { type: Number, default: 0 },
    isRated: { type: Boolean, default: false },
    scheduledFor: Date,
  },
  { timestamps: true }
);

// Auto-generate readable order ID
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `HB-${dateStr}-${random}`;
  }
  // Add to status history on status change
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ deliveryPartnerId: 1, status: 1 });
orderSchema.index({ 'payment.status': 1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
