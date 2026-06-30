"use client";
import { useSession } from "@/app/lib/auth-client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Order {
  _id: string; orderId: string;
  userName: string; userEmail: string;
  items: { name: string; quantity: number; price: number; img: string }[];
  total: number; subtotal: number; delivery: number;
  status: string; paymentMethod: string; paymentStatus: string;
  deliveryAddress: { name: string; phone: string; address: string; city: string };
  createdAt: string;
}

const STATUSES = ["pending","confirmed","processing","delivered","cancelled"];
const statusColors: Record<string,{bg:string;color:string}> = {
  pending:    { bg:"rgba(249,115,22,0.15)", color:"#f97316" },
  confirmed:  { bg:"rgba(99,102,241,0.15)", color:"#818cf8" },
  processing: { bg:"rgba(212,168,67,0.15)", color:"#D4A843" },
  delivered:  { bg:"rgba(34,197,94,0.15)",  color:"#22c55e" },
  cancelled:  { bg:"rgba(239,68,68,0.15)",  color:"#ef4444" },
};

export default function AdminPage() {
  const { data: session, isPending } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/orders?admin=true")
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    }
    setUpdating(null);
  };

  if (isPending) return (
    <div style={{ minHeight:"100vh", background:"#0F0A00", display:"flex",
      alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:40, height:40, border:"3px solid rgba(212,168,67,0.2)",
        borderTopColor:"#D4A843", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!session?.user) return (
    <div style={{ minHeight:"100vh", background:"#0F0A00", display:"flex",
      alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}>
      <div style={{ fontSize:52 }}>🔒</div>
      <h2 style={{ color:"#fff", fontSize:22, fontWeight:800 }}>Access Denied</h2>
      <Link href="/login" style={{ background:"linear-gradient(135deg,#D4A843,#F5C842)",
        padding:"12px 28px", borderRadius:12, fontWeight:700, color:"#0F0A00", textDecoration:"none" }}>
        Sign In
      </Link>
    </div>
  );

  const filtered = orders.filter(o => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch = !search || o.orderId.toLowerCase().includes(search.toLowerCase())
      || o.userName.toLowerCase().includes(search.toLowerCase())
      || o.userEmail.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const paid = orders.filter(o => o.paymentStatus === "paid").length;
  const delivered = orders.filter(o => o.status === "delivered").length;

  return (
    <div style={{ minHeight:"100vh", background:"#0F0A00" }}>
      {/* Navbar */}
      <nav style={{ background:"rgba(15,10,0,0.9)", backdropFilter:"blur(20px)",
        borderBottom:"1px solid rgba(212,168,67,0.15)",
        padding:"0 28px", height:68,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <Link href="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, background:"linear-gradient(135deg,#D4A843,#F5C842)",
              borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div>
            <span style={{ fontWeight:900, fontSize:20, color:"#fff" }}>Fresh<span style={{ color:"#D4A843" }}>Mart</span></span>
          </Link>
          <div style={{ background:"rgba(212,168,67,0.15)", border:"1px solid rgba(212,168,67,0.3)",
            borderRadius:8, padding:"4px 12px", fontSize:12, fontWeight:700, color:"#D4A843" }}>
            ADMIN
          </div>
        </div>
        <Link href="/dashboard" style={{ color:"rgba(255,255,255,0.6)", fontSize:14,
          textDecoration:"none", padding:"8px 16px",
          borderRadius:10, border:"1px solid rgba(255,255,255,0.1)" }}>
          My Account
        </Link>
      </nav>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 24px" }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", marginBottom:8 }}>Admin Dashboard</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:32 }}>
          Manage all orders and monitor sales.
        </p>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:36 }}
          className="admin-stats">
          {[
            { label:"Total Orders", value:orders.length, icon:"📦", color:"#D4A843" },
            { label:"Total Revenue", value:`৳${revenue.toLocaleString()}`, icon:"💰", color:"#22c55e" },
            { label:"Paid Orders", value:paid, icon:"✅", color:"#818cf8" },
            { label:"Delivered", value:delivered, icon:"🚚", color:"#f97316" },
          ].map(s => (
            <div key={s.label} style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(16px)",
              border:"1px solid rgba(255,255,255,0.08)", borderRadius:18, padding:"22px 20px" }}>
              <div style={{ fontSize:26, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:900, color:s.color, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24, alignItems:"center" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍 Search by order ID, name, email..."
            style={{ flex:1, minWidth:220, background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.1)", borderRadius:10,
              padding:"10px 16px", color:"#fff", fontSize:14, outline:"none" }}/>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["all",...STATUSES].map(s => (
              <button key={s} onClick={()=>setFilter(s)}
                style={{ background: filter===s ? "rgba(212,168,67,0.2)" : "rgba(255,255,255,0.05)",
                  border:`1px solid ${filter===s ? "rgba(212,168,67,0.5)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius:20, padding:"7px 16px", cursor:"pointer",
                  color: filter===s ? "#D4A843" : "rgba(255,255,255,0.5)",
                  fontSize:13, fontWeight:600, textTransform:"capitalize", transition:"all 0.2s" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Orders table */}
        {loading ? (
          <div style={{ textAlign:"center", padding:"64px", color:"rgba(255,255,255,0.4)" }}>
            <div style={{ width:36, height:36, border:"3px solid rgba(212,168,67,0.2)",
              borderTopColor:"#D4A843", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }}/>
            Loading orders...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"64px", background:"rgba(255,255,255,0.03)",
            borderRadius:20, border:"1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>📭</div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:16 }}>No orders found</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {filtered.map(order => {
              const sc = statusColors[order.status] ?? statusColors.pending;
              return (
                <div key={order._id}
                  style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(12px)",
                    border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"20px 22px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto",
                    gap:16, alignItems:"start" }} className="order-row">

                    {/* Order info */}
                    <div>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", marginBottom:4 }}>
                        {new Date(order.createdAt).toLocaleDateString("en-BD",
                          { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                      </p>
                      <p style={{ fontSize:14, fontWeight:800, color:"#D4A843",
                        fontFamily:"monospace", marginBottom:4 }}>{order.orderId}</p>
                      <p style={{ fontSize:13, color:"#fff", fontWeight:600 }}>{order.userName}</p>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{order.userEmail}</p>
                    </div>

                    {/* Items */}
                    <div>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginBottom:8,
                        textTransform:"uppercase", letterSpacing:0.5 }}>Items ({order.items.length})</p>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {order.items.slice(0,3).map((item,i) => (
                          <div key={i} style={{ display:"flex", alignItems:"center", gap:6,
                            background:"rgba(255,255,255,0.05)", borderRadius:8, padding:"4px 8px" }}>
                            <div style={{ position:"relative", width:24, height:24,
                              borderRadius:4, overflow:"hidden", flexShrink:0 }}>
                              <Image src={item.img} alt={item.name} fill style={{ objectFit:"cover" }} sizes="24px"/>
                            </div>
                            <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)" }}>
                              {item.name} ×{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)", padding:"4px 8px" }}>
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", marginTop:8 }}>
                        📍 {order.deliveryAddress.city} — {order.deliveryAddress.phone}
                      </p>
                    </div>

                    {/* Payment & total */}
                    <div>
                      <p style={{ fontSize:22, fontWeight:900, color:"#D4A843", marginBottom:6 }}>
                        ৳{order.total.toLocaleString()}
                      </p>
                      <span style={{ background: order.paymentStatus==="paid"
                        ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                        color: order.paymentStatus==="paid" ? "#22c55e" : "#f97316",
                        border:`1px solid ${order.paymentStatus==="paid" ? "rgba(34,197,94,0.3)" : "rgba(249,115,22,0.3)"}`,
                        borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700,
                        display:"inline-block", marginBottom:8 }}>
                        {order.paymentStatus === "paid" ? "✓ Paid" : "⏳ Pending"}
                      </span>
                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                        via {order.paymentMethod.toUpperCase()}
                      </p>
                    </div>

                    {/* Status update */}
                    <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                      <span style={{ background:sc.bg, color:sc.color,
                        border:`1px solid ${sc.color}40`,
                        borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700,
                        textTransform:"capitalize" }}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        disabled={updating === order._id}
                        style={{ background:"rgba(255,255,255,0.07)",
                          border:"1px solid rgba(255,255,255,0.12)", borderRadius:10,
                          padding:"7px 12px", color:"#fff", fontSize:12,
                          outline:"none", cursor:"pointer",
                          opacity: updating === order._id ? 0.5 : 1 }}>
                        {STATUSES.map(s => (
                          <option key={s} value={s} style={{ background:"#1a1200" }}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      {updating === order._id && (
                        <div style={{ width:16, height:16, border:"2px solid rgba(212,168,67,0.3)",
                          borderTopColor:"#D4A843", borderRadius:"50%",
                          animation:"spin 0.7s linear infinite" }}/>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @media(max-width:900px){
          .admin-stats{grid-template-columns:repeat(2,1fr)!important;}
          .order-row{grid-template-columns:1fr 1fr!important;}
        }
        @media(max-width:580px){
          .admin-stats{grid-template-columns:1fr!important;}
          .order-row{grid-template-columns:1fr!important;}
        }
      `}</style>
    </div>
  );
}
