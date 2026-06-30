"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function FloatingActions() {
  const { count } = useCart();
  const [showTop, setShowTop] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Floating cart button — mobile only */}
      {count > 0 && (
        <button onClick={() => setCartOpen(true)}
          style={{
            position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #D4A843, #F5C842)",
            border: "none", borderRadius: 40, padding: "14px 28px",
            fontWeight: 800, fontSize: 15, cursor: "pointer", color: "#0F0A00",
            zIndex: 200, boxShadow: "0 8px 28px rgba(212,168,67,0.5)",
            display: "flex", alignItems: "center", gap: 10,
            animation: "bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          className="float-cart">
          🛒 View Cart
          <span style={{ background: "#0F0A00", color: "#D4A843",
            borderRadius: "50%", width: 24, height: 24,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900 }}>{count}</span>
        </button>
      )}

      {/* Scroll to top */}
      {showTop && (
        <button onClick={scrollTop}
          style={{
            position: "fixed", bottom: 24, right: 24,
            background: "rgba(15,10,0,0.85)", backdropFilter: "blur(16px)",
            border: "1px solid rgba(212,168,67,0.35)", borderRadius: "50%",
            width: 48, height: 48, cursor: "pointer", color: "#D4A843",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            transition: "all 0.2s", animation: "fadeIn 0.3s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "none")}
          aria-label="Scroll to top">
          ↑
        </button>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @keyframes bounceIn { from{opacity:0;transform:translateX(-50%) scale(0.7);} to{opacity:1;transform:translateX(-50%) scale(1);} }
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        @media (min-width: 769px) { .float-cart { display: none !important; } }
      `}</style>
    </>
  );
}
