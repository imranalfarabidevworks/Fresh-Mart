"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export interface ProductDetailData {
  id: number; name: string; category: string;
  price: number; originalPrice?: number; unit: string;
  img: string; badge?: string; rating: number; reviews: number;
  description?: string; nutrition?: Record<string, string>;
}

interface Props {
  product: ProductDetailData | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const { addToCart, cart } = useCart();
  const { toggle, isWished } = useWishlist();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc"|"nutrition">("desc");

  if (!product) return null;

  const inCart = cart.some(c => c.id === product.id);
  const wished = isWished(product.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({ id: product.id, name: product.name,
        price: product.price, img: product.img, unit: product.unit });
    }
    showToast(`${qty}× ${product.name} added to cart!`, "success");
    onClose();
  };

  const handleWish = () => {
    toggle({ id: product.id, name: product.name,
      price: product.price, img: product.img, unit: product.unit });
    showToast(wished ? `Removed from wishlist` : `${product.name} wishlisted!`, "wish");
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}/>

      {/* Modal */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 800,
        maxHeight: "90vh", overflowY: "auto",
        background: "rgba(18,12,1,0.97)",
        backdropFilter: "blur(30px)",
        border: "1px solid rgba(212,168,67,0.25)",
        borderRadius: 28, margin: "0 16px",
        boxShadow: "0 48px 96px rgba(0,0,0,0.7)",
        animation: "slideUp 0.3s ease",
        display: "grid", gridTemplateColumns: "1fr 1fr",
      }} className="detail-modal">

        {/* Left: Image */}
        <div style={{ position: "relative", minHeight: 380, overflow: "hidden",
          borderRadius: "28px 0 0 28px" }}>
          <Image src={product.img} alt={product.name} fill
            style={{ objectFit: "cover" }} sizes="400px" priority/>
          <div style={{ position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 60%, rgba(18,12,1,0.8) 100%)" }}/>

          {product.badge && (
            <span style={{ position: "absolute", top: 20, left: 20,
              background: product.badge === "Sale" ? "rgba(239,68,68,0.9)"
                : product.badge === "Hot" ? "rgba(249,115,22,0.9)"
                : product.badge === "Organic" ? "rgba(212,168,67,0.9)"
                : "rgba(34,197,94,0.9)",
              color: product.badge === "Organic" ? "#0F0A00" : "#fff",
              fontSize: 12, fontWeight: 800, padding: "5px 14px", borderRadius: 20 }}>
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <div style={{ position: "absolute", bottom: 20, left: 20,
              background: "rgba(15,10,0,0.85)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: 12, padding: "8px 14px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>You save</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#ef4444" }}>{discount}% OFF</div>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Close */}
          <button onClick={onClose} style={{ alignSelf: "flex-end", background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
            width: 34, height: 34, cursor: "pointer", color: "rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, marginBottom: 16 }}>✕</button>

          <p style={{ fontSize: 11, color: "#D4A843", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
            {product.category}
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff",
            marginBottom: 10, letterSpacing: "-0.5px", lineHeight: 1.2 }}>
            {product.name}
          </h2>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <span style={{ color: "#D4A843", fontSize: 15 }}>
              {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5 - Math.floor(product.rating))}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{product.rating}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#D4A843" }}>৳{product.price}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{product.unit}</span>
            {product.originalPrice && (
              <span style={{ fontSize: 16, color: "rgba(255,255,255,0.25)",
                textDecoration: "line-through" }}>৳{product.originalPrice}</span>
            )}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 16,
            background: "rgba(255,255,255,0.04)", borderRadius: 12,
            padding: 4, border: "1px solid rgba(255,255,255,0.07)" }}>
            {(["desc","nutrition"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, border: "none", borderRadius: 10, padding: "8px",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                  background: activeTab === tab ? "rgba(212,168,67,0.2)" : "transparent",
                  color: activeTab === tab ? "#D4A843" : "rgba(255,255,255,0.4)" }}>
                {tab === "desc" ? "Description" : "Nutrition"}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, marginBottom: 24, minHeight: 80 }}>
            {activeTab === "desc" ? (
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8 }}>
                {product.description ?? `Premium quality ${product.name.toLowerCase()} sourced directly from certified organic farms. Handpicked at peak ripeness to ensure the best flavour and nutritional value. No pesticides, no artificial preservatives — just pure, fresh goodness delivered to your door.`}
              </p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(product.nutrition ?? {
                  "Calories": "45 kcal", "Protein": "0.8g",
                  "Carbs": "11g", "Fibre": "2.1g",
                  "Fat": "0.2g", "Vitamin C": "28mg",
                }).map(([k, v]) => (
                  <div key={k} style={{ background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)",
                      textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#D4A843", marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Qty picker */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Qty:</span>
            <div style={{ display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "6px 14px" }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ background: "none", border: "none", color: "#D4A843",
                  cursor: "pointer", fontSize: 20, fontWeight: 700, lineHeight: 1 }}>−</button>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff",
                minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                style={{ background: "none", border: "none", color: "#D4A843",
                  cursor: "pointer", fontSize: 20, fontWeight: 700, lineHeight: 1 }}>+</button>
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              = ৳{(product.price * qty).toLocaleString()}
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={handleAdd}
              style={{
                flex: 1, background: "linear-gradient(135deg, #D4A843, #F5C842)",
                border: "none", borderRadius: 14, padding: "14px",
                fontWeight: 800, fontSize: 15, cursor: "pointer", color: "#0F0A00",
                boxShadow: "0 6px 20px rgba(212,168,67,0.4)", transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
              {inCart ? "+ Add More to Cart" : "🛒 Add to Cart"}
            </button>

            <button onClick={handleWish}
              style={{
                width: 50, height: 50, flexShrink: 0,
                background: wished ? "rgba(236,72,153,0.2)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${wished ? "rgba(236,72,153,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14, cursor: "pointer", fontSize: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
              {wished ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .detail-modal { grid-template-columns: 1fr !important; }
          .detail-modal > div:first-child { border-radius: 28px 28px 0 0 !important; min-height: 240px !important; }
        }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
