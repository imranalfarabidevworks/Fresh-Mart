"use client";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQty, total, count } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)", zIndex: 300,
        }}/>
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 420, maxWidth: "100vw",
        background: "rgba(20,14,2,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderLeft: "1px solid rgba(212,168,67,0.25)",
        zIndex: 301,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Your Cart</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              {count} item{count !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10, width: 38, height: 38, cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.4)" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🛒</div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Add some fresh products!</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{
                display: "flex", gap: 14, alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ position: "relative", width: 70, height: 70,
                  borderRadius: 14, overflow: "hidden", flexShrink: 0,
                  border: "1px solid rgba(212,168,67,0.2)" }}>
                  <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} sizes="70px"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.name}
                  </h4>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{item.unit}</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#D4A843", marginTop: 4 }}>
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{ background: "rgba(239,68,68,0.15)", border: "none",
                      borderRadius: 8, padding: "4px 8px", cursor: "pointer",
                      color: "#ef4444", fontSize: 12 }}>
                    ✕
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "4px 8px" }}>
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      style={{ background: "none", border: "none", color: "#D4A843",
                        cursor: "pointer", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>−</button>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#fff", minWidth: 16, textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{ background: "none", border: "none", color: "#D4A843",
                        cursor: "pointer", fontSize: 16, fontWeight: 700, lineHeight: 1 }}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Subtotal</span>
              <span style={{ color: "#fff", fontWeight: 700 }}>৳{total.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Delivery</span>
              <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>
                {total >= 500 ? "FREE" : "৳60"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between",
              margin: "14px 0", paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>Total</span>
              <span style={{ color: "#D4A843", fontSize: 20, fontWeight: 900 }}>
                ৳{(total >= 500 ? total : total + 60).toLocaleString()}
              </span>
            </div>
            {total < 500 && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 14 }}>
                Add ৳{500 - total} more for FREE delivery
              </p>
            )}
            <button onClick={() => { onClose(); setCheckoutOpen(true); }}
              style={{
                width: "100%", background: "linear-gradient(135deg, #D4A843, #F5C842)",
                border: "none", borderRadius: 14, padding: "15px",
                fontWeight: 800, fontSize: 16, cursor: "pointer", color: "#0F0A00",
                boxShadow: "0 6px 20px rgba(212,168,67,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}
