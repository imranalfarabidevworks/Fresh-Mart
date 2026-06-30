"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useSession, signOut } from "../lib/auth-client";
import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

export default function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { data: session, isPending } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links = ["Seasonal", "Fruits", "Dairy", "Fresh Juice"];
  const isAdmin = session?.user && (session.user as { role?: string }).role === "admin";

  return (
    <>
      <nav style={{
        background: "rgba(15,10,0,0.75)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(212,168,67,0.18)",
        position: "sticky", top: 0, zIndex: 200,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
            <div style={{ width: 42, height: 42, background: "linear-gradient(135deg, #D4A843, #F5C842)",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, boxShadow: "0 4px 14px rgba(212,168,67,0.4)" }}>🌿</div>
            <div>
              <span style={{ fontWeight: 900, fontSize: 22, color: "#fff", letterSpacing: "-0.5px" }}>Fresh</span>
              <span style={{ fontWeight: 900, fontSize: 22, color: "#D4A843", letterSpacing: "-0.5px" }}>Mart</span>
            </div>
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: 36 }} className="desk-nav">
            {links.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none",
                  fontSize: 14, fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#D4A843")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}>
                {item}
              </a>
            ))}
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "9px 14px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                color: "rgba(255,255,255,0.6)", fontSize: 13, transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,168,67,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <span className="search-text">Search</span>
            </button>

            {/* Wishlist */}
            <button onClick={() => setWishOpen(true)}
              style={{ position: "relative", background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                width: 42, height: 42, cursor: "pointer",
                color: wishCount > 0 ? "#ec4899" : "rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(236,72,153,0.4)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}>
              {wishCount > 0 ? "♥" : "♡"}
              {wishCount > 0 && (
                <span style={{ position: "absolute", top: 4, right: 4,
                  background: "#ec4899", color: "#fff",
                  width: 16, height: 16, borderRadius: "50%",
                  fontSize: 10, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {wishCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)}
              style={{ position: "relative", background: "rgba(212,168,67,0.15)",
                border: "1px solid rgba(212,168,67,0.35)", borderRadius: 10,
                padding: "9px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                color: "#D4A843", fontWeight: 700, fontSize: 14, transition: "all 0.2s" }}
              onMouseEnter={e => { (e.currentTarget.style.background = "rgba(212,168,67,0.25)"); (e.currentTarget.style.transform = "translateY(-1px)"); }}
              onMouseLeave={e => { (e.currentTarget.style.background = "rgba(212,168,67,0.15)"); (e.currentTarget.style.transform = "none"); }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <span className="cart-text">Cart</span>
              {count > 0 && (
                <span style={{ background: "#D4A843", color: "#0F0A00",
                  width: 20, height: 20, borderRadius: "50%",
                  fontSize: 11, fontWeight: 900,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {count}
                </span>
              )}
            </button>

            {/* Auth */}
            {isPending ? (
              <div style={{ width: 38, height: 38, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)" }}/>
            ) : session?.user ? (
              <div style={{ position: "relative" }}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden",
                    border: "2px solid rgba(212,168,67,0.4)", cursor: "pointer",
                    background: "linear-gradient(135deg,#D4A843,#F5C842)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 800, color: "#0F0A00", padding: 0 }}>
                  {session.user.image
                    ? <Image src={session.user.image} alt="avatar" width={38} height={38} style={{ objectFit: "cover" }}/>
                    : session.user.name?.[0]?.toUpperCase() ?? "U"}
                </button>

                {userMenuOpen && (
                  <>
                    <div onClick={() => setUserMenuOpen(false)}
                      style={{ position: "fixed", inset: 0, zIndex: 250 }}/>
                    <div style={{ position: "absolute", top: 50, right: 0, zIndex: 251,
                      background: "rgba(18,12,1,0.97)", backdropFilter: "blur(20px)",
                      border: "1px solid rgba(212,168,67,0.25)", borderRadius: 16,
                      padding: 8, minWidth: 200, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
                      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{session.user.name}</p>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{session.user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 14px", borderRadius: 10, textDecoration: "none",
                          color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500 }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(212,168,67,0.1)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        📦 My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: 10,
                            padding: "9px 14px", borderRadius: 10, textDecoration: "none",
                            color: "#D4A843", fontSize: 13, fontWeight: 600 }}
                          onMouseEnter={e=>(e.currentTarget.style.background="rgba(212,168,67,0.1)")}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                          ⚙ Admin Panel
                        </Link>
                      )}
                      <button onClick={() => { setUserMenuOpen(false); signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } }); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%",
                          padding: "9px 14px", borderRadius: 10, background: "none", border: "none",
                          color: "#ef4444", fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.1)")}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        🚪 Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/login"
                style={{ background: "linear-gradient(135deg,#D4A843,#F5C842)",
                  border: "none", borderRadius: 10, padding: "9px 18px",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#0F0A00",
                  textDecoration: "none" }}>
                Sign In
              </Link>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              style={{ display: "none", background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                padding: "9px 12px", cursor: "pointer", color: "#fff" }}
              className="ham-btn">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
              </svg>
            </button>
          </div>
        </div>

        {searchOpen && (
          <div style={{ padding: "0 28px 16px", maxWidth: 1280, margin: "0 auto" }}>
            <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)}
              placeholder="Search fruits, vegetables, nuts, juice..."
              style={{ width: "100%", background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(212,168,67,0.35)", borderRadius: 12,
                padding: "13px 20px", color: "#fff", fontSize: 15, outline: "none" }}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}/>
          </div>
        )}

        {menuOpen && (
          <div style={{ background: "rgba(12,8,0,0.97)", padding: "8px 28px 20px",
            borderTop: "1px solid rgba(212,168,67,0.1)" }}>
            {links.map(item => (
              <a key={item} href="#" onClick={() => setMenuOpen(false)}
                style={{ display: "block", color: "rgba(255,255,255,0.7)", textDecoration: "none",
                  padding: "13px 0", fontSize: 15, fontWeight: 500,
                  borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {item}
              </a>
            ))}
            {!session?.user && (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ display: "block", marginTop: 12, textAlign: "center",
                  background: "linear-gradient(135deg,#D4A843,#F5C842)",
                  padding: "12px", borderRadius: 10, fontWeight: 700,
                  color: "#0F0A00", textDecoration: "none" }}>
                Sign In
              </Link>
            )}
          </div>
        )}

        <style>{`
          @media (max-width: 768px) {
            .desk-nav { display: none !important; }
            .ham-btn { display: flex !important; }
            .search-text { display: none !important; }
            .cart-text { display: none !important; }
          }
        `}</style>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishOpen} onClose={() => setWishOpen(false)} />
    </>
  );
}
