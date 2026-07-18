import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  menuItemId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  likes: number;
  likedBy: mongoose.Types.ObjectId[];
  isVerifiedPurchase: boolean;
  sentimentScore?: number;
  sentimentLabel?: 'positive' | 'neutral' | 'negative';
  adminReply?: { message: string; repliedAt: Date };
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 100 },
    comment: { type: String, required: true, minlength: 10, maxlength: 1000 },
    images: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    likedBy: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    isVerifiedPurchase: { type: Boolean, default: true },
    sentimentScore: Number,
    sentimentLabel: { type: String, enum: ['positive', 'neutral', 'negative'] },
    adminReply: {
      message: String,
      repliedAt: Date,
    },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ menuItemId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, menuItemId: 1 }, { unique: true });

// Update MenuItem rating after save
reviewSchema.post('save', async function () {
  const MenuItem = mongoose.model('MenuItem');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { menuItemId: this.menuItemId, isHidden: false } },
    { $group: { _id: '$menuItemId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (stats.length > 0) {
    await MenuItem.findByIdAndUpdate(this.menuItemId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      ratingCount: stats[0].count,
    });
  }
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);
