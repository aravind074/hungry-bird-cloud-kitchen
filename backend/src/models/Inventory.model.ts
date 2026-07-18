import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryItem extends Document {
  menuItemId?: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  category: 'ingredient' | 'packaging' | 'equipment' | 'other';
  unit: string;  // kg, litre, pieces
  currentStock: number;
  minStockLevel: number;  // reorder threshold
  maxStockLevel: number;
  reorderQuantity: number;
  costPerUnit: number;
  supplier?: {
    name: string;
    contact: string;
    email: string;
  };
  transactions: {
    type: 'add' | 'remove' | 'adjustment';
    quantity: number;
    reason: string;
    performedBy: mongoose.Types.ObjectId;
    timestamp: Date;
    referenceId?: string;
  }[];
  isActive: boolean;
  lastRestockedAt?: Date;
  predictedRunoutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventoryItem>(
  {
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: {
      type: String,
      enum: ['ingredient', 'packaging', 'equipment', 'other'],
      default: 'ingredient',
    },
    unit: { type: String, required: true },
    currentStock: { type: Number, required: true, default: 0 },
    minStockLevel: { type: Number, required: true, default: 10 },
    maxStockLevel: { type: Number, required: true, default: 1000 },
    reorderQuantity: { type: Number, required: true, default: 100 },
    costPerUnit: { type: Number, default: 0 },
    supplier: {
      name: String,
      contact: String,
      email: String,
    },
    transactions: [{
      type: { type: String, enum: ['add', 'remove', 'adjustment'], required: true },
      quantity: { type: Number, required: true },
      reason: { type: String, required: true },
      performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      timestamp: { type: Date, default: Date.now },
      referenceId: String,
    }],
    isActive: { type: Boolean, default: true },
    lastRestockedAt: Date,
    predictedRunoutDate: Date,
  },
  { timestamps: true }
);

inventorySchema.index({ currentStock: 1, minStockLevel: 1 });
inventorySchema.index({ sku: 1 });

export const Inventory = mongoose.model<IInventoryItem>('Inventory', inventorySchema);
