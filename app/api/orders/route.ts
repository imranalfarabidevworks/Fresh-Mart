import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { Order } from "@/app/models/Order";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// POST: Place a new order
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const {
      items, subtotal, delivery, total,
      paymentMethod, paymentTransactionId,
      deliveryAddress,
    } = body;

    if (!items?.length || !deliveryAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = `FM-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

    const order = await Order.create({
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      items,
      subtotal,
      delivery,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      paymentTransactionId: paymentTransactionId || null,
      deliveryAddress,
      orderId,
      status: "confirmed",
    });

    return NextResponse.json({ success: true, orderId: order.orderId, _id: order._id });
  } catch (err) {
    console.error("Order POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: My orders (user) or all orders (admin)
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    const query = isAdmin ? {} : { userId: session.user.id };
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Order GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
