"use client";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Order {
  _id: string;
  orderId: string;
  items: { name: string; quantity: number; price: number; img: string }[];
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryAddress: { name: string; phone: string; address: string; city: string };
  createdAt: string;
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg:"rgba(249,115,22,0.15)", color:"#f97316", label:"⏳ Pending" },
  confirmed:  { bg:"rgba(99,102,241,0.15)", color:"#818cf8", label:"✓ Confirmed" },
  processing: { bg:"rgba(212,168,67,0.15)", color:"#D4A843", label:"⚙ Processing" },
  delivered:  { bg:"rgba(34,197,94,0.15)",  color:"#22c55e", label:"✅ Delivered" },
  cancelled:  { bg:"rgba(239,68,68,0.15)",  color:"#ef4444", label:"✕ Cancelled" },
};

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/orders")
        .then(r => r.json())
        .then(d => { setOrders(d.orders || []); setLoadingOrders(false); })
        .catch(() => setLoadingOrders(false));
    }
  }, [session]);

  if (isPending) return (
    <div style={{ minHeight:"100vh", background:"#0F0A00", display:"flex",
      alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(212,168,67,0.2)",
        borderTopColor:"#D4A843", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!session?.user) return (
    <div style={{ minHeight:"100vh", background:"#0F0A00", display:"flex",
      alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
      <div style={{ fontSize:48 }}>🔒</div>
      <h2 style={{ color:"#fff", fontSize:22, fontWeight:800 }}>Please sign in</h2>
      <Link href="/login" style={{ background:"linear-gradient(135deg,#D4A843,#F5C842)",
        padding:"12px 28px", borderRadius:12, fontWeight:700, color:"#0F0A00",
        textDecoration:"none" }}>Sign In →</Link>
    </div>
  );

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter(o => o.status === "delivered").length;

  return (
    <div style={{ minHeight:"100vh", background:"#0F0A00" }}>
      {/* Top nav */}
      <nav style={{ background:"rgba(15,10,0,0.85)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(212,168,67,0.15)",
        padding:"0 28px", height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:38, height:38, background:"linear-gradient(135deg,#D4A843,#F5C842)",
            borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div>
          <span style={{ fontWeight:900, fontSize:20, color:"#fff" }}>Fresh<span style={{ color:"#D4A843" }}>Mart</span></span>
        </Link>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Link href="/" style={{ color:"rgba(255,255,255,0.6)", fontSize:14, textDecoration:"none",
            padding:"8px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,0.1)" }}>
            ← Shop
          </Link>
          <button onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } })}
            style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)",
              borderRadius:10, padding:"8px 16px", cursor:"pointer",
              color:"#ef4444", fontWeight:600, fontSize:14 }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:36,
          background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)",
          border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"24px 28px" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", overflow:"hidden",
            background:"linear-gradient(135deg,#D4A843,#F5C842)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, fontWeight:900, color:"#0F0A00", flexShrink:0 }}>
            {session.user.image
              ? <Image src={session.user.image} alt="avatar" width={64} height={64} style={{ objectFit:"cover" }}/>
              : session.user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div style={{ flex:1 }}>
            <h1 style={{ fontSize:24, fontWeight:900, color:"#fff", marginBottom:4 }}>
              Welcome back, {session.user.name?.split(" ")[0]}! 👋
            </h1>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:14 }}>{session.user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:36 }}
          className="dash-stats">
          {[
            { label:"Total Orders", value:orders.length, icon:"📦", color:"#D4A843" },
            { label:"Total Spent", value:`৳${totalSpent.toLocaleString()}`, icon:"💰", color:"#22c55e" },
            { label:"Delivered", value:delivered, icon:"✅", color:"#818cf8" },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(16px)",
              border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"24px 22px" }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:900, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Orders */}
        <h2 style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:20 }}>My Orders</h2>

        {loadingOrders ? (
          <div style={{ textAlign:"center", padding:"48px", color:"rgba(255,255,255,0.4)" }}>
            <div style={{ width:32, height:32, border:"3px solid rgba(212,168,67,0.2)",
              borderTopColor:"#D4A843", borderRadius:"50%", animation:"spin 0.7s linear infinite",
              margin:"0 auto 12px" }}/>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign:"center", padding:"64px 24px",
            background:"rgba(255,255,255,0.04)", borderRadius:20,
            border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize:52, marginBottom:14 }}>📦</div>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:16, fontWeight:600 }}>No orders yet</p>
            <Link href="/" style={{ display:"inline-block", marginTop:16,
              background:"linear-gradient(135deg,#D4A843,#F5C842)",
              padding:"12px 28px", borderRadius:12, fontWeight:700,
              color:"#0F0A00", textDecoration:"none" }}>
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {orders.map(order => {
              const sc = statusColors[order.status] ?? statusColors.pending;
              return (
                <div key={order._id}
                  style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(16px)",
                    border:"1px solid rgba(255,255,255,0.08)", borderRadius:18,
                    padding:"22px 24px", transition:"border-color 0.2s" }}
                  onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(212,168,67,0.25)")}
                  onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.08)")}>

                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:16 }}>
                    <div>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginBottom:4 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-BD", { day:"numeric", month:"short", year:"numeric" })}
                      </p>
                      <h3 style={{ fontSize:15, fontWeight:700, color:"#D4A843",
                        fontFamily:"monospace", letterSpacing:0.5 }}>{order.orderId}</h3>
                    </div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                      <span style={{ background:sc.bg, color:sc.color, border:`1px solid ${sc.color}40`,
                        borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700 }}>
                        {sc.label}
                      </span>
                      <span style={{ background:"rgba(255,255,255,0.07)",
                        color:"rgba(255,255,255,0.6)",
                        border:"1px solid rgba(255,255,255,0.1)",
                        borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:600 }}>
                        {order.paymentMethod === "bkash" ? "📱 bKash"
                          : order.paymentMethod === "nagad" ? "📲 Nagad"
                          : order.paymentMethod === "card" ? "💳 Card"
                          : "💵 COD"}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                    {order.items.slice(0,4).map((item, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:8,
                        background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                        borderRadius:10, padding:"6px 12px" }}>
                        <div style={{ position:"relative", width:28, height:28,
                          borderRadius:6, overflow:"hidden", flexShrink:0 }}>
                          <Image src={item.img} alt={item.name} fill style={{ objectFit:"cover" }} sizes="28px"/>
                        </div>
                        <span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>
                          {item.name} × {item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div style={{ background:"rgba(255,255,255,0.04)",
                        border:"1px solid rgba(255,255,255,0.07)",
                        borderRadius:10, padding:"6px 12px",
                        color:"rgba(255,255,255,0.4)", fontSize:12 }}>
                        +{order.items.length - 4} more
                      </div>
                    )}
                  </div>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                    paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>
                      📍 {order.deliveryAddress.address}, {order.deliveryAddress.city}
                    </p>
                    <span style={{ fontSize:20, fontWeight:900, color:"#D4A843" }}>
                      ৳{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @media(max-width:640px){ .dash-stats{grid-template-columns:1fr!important;} }
      `}</style>
    </div>
  );
}
