import mongoose, { Document, Schema } from 'mongoose';

export type DietaryTag = 'veg' | 'vegan' | 'non-veg' | 'egg' | 'gluten-free' | 'dairy-free' | 'halal' | 'jain';
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | 'beverage';

export interface INutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

export interface IMenuItem extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  subCategory?: string;
  images: string[];
  thumbnail: string;
  mealType: MealType[];
  dietaryTags: DietaryTag[];
  spiceLevel: SpiceLevel;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: INutritionalInfo;
  preparationTime: number; // in minutes
  isAvailable: boolean;
  isSubscriptionItem: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  rating: number;
  ratingCount: number;
  orderCount: number;
  stock: number;
  maxOrderQuantity: number;
  customizations?: {
    name: string;
    options: { label: string; price: number }[];
    isRequired: boolean;
    maxSelections: number;
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200, index: 'text' },
    description: { type: String, required: true, maxlength: 2000 },
    shortDescription: { type: String, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,
    discountPercent: { type: Number, min: 0, max: 100 },
    category: { type: String, required: true, index: true },
    subCategory: String,
    images: { type: [String], default: [] },
    thumbnail: { type: String, required: true },
    mealType: {
      type: [String],
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'beverage'],
      default: [],
    },
    dietaryTags: {
      type: [String],
      enum: ['veg', 'vegan', 'non-veg', 'egg', 'gluten-free', 'dairy-free', 'halal', 'jain'],
      default: [],
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra-hot'],
      default: 'medium',
    },
    ingredients: { type: [String], default: [] },
    allergens: { type: [String], default: [] },
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
      sodium: { type: Number, default: 0 },
    },
    preparationTime: { type: Number, default: 20 },
    isAvailable: { type: Boolean, default: true },
    isSubscriptionItem: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    orderCount: { type: Number, default: 0 },
    stock: { type: Number, default: -1 }, // -1 = unlimited
    maxOrderQuantity: { type: Number, default: 10 },
    customizations: [
      {
        name: String,
        options: [{ label: String, price: Number }],
        isRequired: Boolean,
        maxSelections: { type: Number, default: 1 },
      },
    ],
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: (_doc, ret) => { delete ret.__v; return ret; } },
  }
);

menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1, isPopular: 1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ rating: -1 });

// Virtual: effective price after discount
menuItemSchema.virtual('effectivePrice').get(function () {
  if (this.discountPercent && this.discountPercent > 0) {
    return this.price * (1 - this.discountPercent / 100);
  }
  return this.price;
});

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
