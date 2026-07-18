import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: 'order' | 'subscription' | 'payment' | 'promo' | 'system' | 'delivery';
  data?: Record<string, string>;
  isRead: boolean;
  readAt?: Date;
  fcmMessageId?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, maxlength: 100 },
    body: { type: String, required: true, maxlength: 500 },
    type: {
      type: String,
      enum: ['order', 'subscription', 'payment', 'promo', 'system', 'delivery'],
      required: true,
    },
    data: Schema.Types.Mixed,
    isRead: { type: Boolean, default: false, index: true },
    readAt: Date,
    fcmMessageId: String,
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
