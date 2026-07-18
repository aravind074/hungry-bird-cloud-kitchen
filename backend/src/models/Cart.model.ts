import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
  customizations?: { name: string; option: string; price: number }[];
  specialInstructions?: string;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string;
  couponDiscount?: number;
  savedForLater: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },
  thumbnail: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, max: 20 },
  customizations: [{ name: String, option: String, price: { type: Number, default: 0 } }],
  specialInstructions: { type: String, maxlength: 500 },
}, { _id: true });

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    couponCode: String,
    couponDiscount: { type: Number, default: 0 },
    savedForLater: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
