import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'admin' | 'kitchen_staff' | 'delivery_partner';

export interface IAddress {
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firebaseUid?: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  addresses: IAddress[];
  dietaryPreferences: string[];
  allergies: string[];
  fcmTokens: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLogin?: Date;
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  loyaltyPoints: number;
  refreshToken?: string;
  // Delivery partner specific
  deliveryZone?: string;
  vehicleType?: 'bike' | 'bicycle' | 'scooter';
  isAvailable?: boolean;
  currentLocation?: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const addressSchema = new Schema<IAddress>({
  label: { type: String, default: 'Home' },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: String,
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, sparse: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true, trim: true },
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: ['customer', 'admin', 'kitchen_staff', 'delivery_partner'],
      default: 'customer',
    },
    avatar: String,
    addresses: { type: [addressSchema], default: [] },
    dietaryPreferences: { type: [String], default: [] },
    allergies: { type: [String], default: [] },
    fcmTokens: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    lastLogin: Date,
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    loyaltyPoints: { type: Number, default: 0 },
    refreshToken: { type: String, select: false },
    // Delivery partner
    deliveryZone: String,
    vehicleType: { type: String, enum: ['bike', 'bicycle', 'scooter'] },
    isAvailable: { type: Boolean, default: false },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.passwordHash;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash') || !this.passwordHash) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

// Auto-generate referral code
userSchema.pre('save', function (next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
