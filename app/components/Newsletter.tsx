"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    setError(""); setSubmitted(true); setEmail("");
  };

  return (
    <section style={{ padding:"64px 28px", background:"#0F0A00", position:"relative", overflow:"hidden" }}>
      {/* BG glow */}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:600, height:300, borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(212,168,67,0.12) 0%, transparent 70%)",
        pointerEvents:"none" }}/>

      <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:52, marginBottom:18 }}>🌿</div>
        <h2 style={{ fontSize:38, fontWeight:900, color:"#fff",
          marginBottom:14, letterSpacing:"-0.5px" }}>Get Fresh Deals Daily</h2>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:16, marginBottom:36, lineHeight:1.7 }}>
          Subscribe and get exclusive deals, seasonal recipes, and early access to new arrivals every week.
        </p>

        {submitted ? (
          <div style={{
            background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.3)",
            backdropFilter:"blur(12px)", borderRadius:20, padding:"28px 40px", display:"inline-block",
          }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🎉</div>
            <div style={{ fontWeight:800, color:"#22c55e", fontSize:18 }}>You&apos;re subscribed!</div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginTop:6 }}>Welcome to the FreshMart family!</div>
          </div>
        ) : (
          <>
            <div style={{
              display:"flex", maxWidth:480, margin:"0 auto",
              background:"rgba(255,255,255,0.06)", backdropFilter:"blur(16px)",
              border:`1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.12)"}`,
              borderRadius:16, padding:6, transition:"border-color 0.2s",
            }}>
              <input type="email" placeholder="Enter your email..." value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{ flex:1, border:"none", outline:"none", background:"transparent",
                  padding:"10px 18px", fontSize:15, color:"#fff" }}
              />
              <button onClick={handleSubmit}
                style={{
                  background:"linear-gradient(135deg,#D4A843,#F5C842)",
                  border:"none", borderRadius:12, padding:"11px 26px",
                  fontWeight:800, fontSize:14, cursor:"pointer", color:"#0F0A00",
                  whiteSpace:"nowrap", transition:"all 0.2s",
                }}
                onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.03)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")}>
                Subscribe
              </button>
            </div>
            {error && <p style={{ color:"#ef4444", fontSize:13, marginTop:10, fontWeight:600 }}>{error}</p>}
            <p style={{ color:"rgba(255,255,255,0.25)", fontSize:12, marginTop:14 }}>
              🔒 No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
