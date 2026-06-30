import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
  unit: string;
}

export interface IOrder extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  items: IOrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: "pending" | "confirmed" | "processing" | "delivered" | "cancelled";
  paymentMethod: "bkash" | "nagad" | "card" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  paymentTransactionId?: string;
  deliveryAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  img: { type: String, required: true },
  unit: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    delivery: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "card", "cod"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentTransactionId: { type: String },
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    orderId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
