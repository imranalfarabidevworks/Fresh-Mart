"use client";
import Image from "next/image";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function WishlistDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wishlist, toggle } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const moveToCart = (item: typeof wishlist[0]) => {
    addToCart({ id: item.id, name: item.name, price: item.price, img: item.img, unit: item.unit });
    toggle(item);
    showToast(`${item.name} moved to cart!`, "success");
  };

  return (
    <>
      {open && <div onClick={onClose} style={{ position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 300 }}/>}

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 400, maxWidth: "100vw",
        background: "rgba(18,12,1,0.96)", backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderLeft: "1px solid rgba(236,72,153,0.2)",
        zIndex: 301,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>♥ Wishlist</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose}
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, width: 36, height: 36, cursor: "pointer", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>♡</div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>Your wishlist is empty</p>
              <p style={{ fontSize: 13, marginTop: 6 }}>Heart items you love!</p>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center",
                padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ position: "relative", width: 64, height: 64,
                  borderRadius: 12, overflow: "hidden", flexShrink: 0,
                  border: "1px solid rgba(236,72,153,0.2)" }}>
                  <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} sizes="64px"/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h4>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#D4A843", marginTop: 4 }}>৳{item.price}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button onClick={() => moveToCart(item)}
                    style={{ background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.3)",
                      borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                      color: "#D4A843", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>
                    + Cart
                  </button>
                  <button onClick={() => toggle(item)}
                    style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)",
                      borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                      color: "#ec4899", fontWeight: 700, fontSize: 12 }}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {wishlist.length > 0 && (
          <div style={{ padding: "20px 28px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => { wishlist.forEach(i => addToCart(i)); wishlist.forEach(i => toggle(i)); showToast("All wishlisted items added to cart!", "success"); onClose(); }}
              style={{ width: "100%", background: "linear-gradient(135deg, #ec4899, #f43f5e)",
                border: "none", borderRadius: 14, padding: "14px",
                fontWeight: 800, fontSize: 15, cursor: "pointer", color: "#fff",
                boxShadow: "0 6px 20px rgba(236,72,153,0.3)" }}>
              Move All to Cart →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
