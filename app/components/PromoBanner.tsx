"use client";
import Image from "next/image";

export default function PromoBanner() {
  return (
    <section style={{ padding:"0 28px 64px", background:"#0F0A00" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{
          borderRadius:28, overflow:"hidden",
          display:"grid", gridTemplateColumns:"1fr 1fr",
          minHeight:340, position:"relative",
          border:"1px solid rgba(212,168,67,0.2)",
          boxShadow:"0 24px 60px rgba(0,0,0,0.4)",
        }} className="promo-grid">
          {/* Left */}
          <div style={{
            background:"linear-gradient(135deg, rgba(30,20,0,0.95) 0%, rgba(20,14,2,0.9) 100%)",
            backdropFilter:"blur(20px)",
            padding:"52px 48px",
            display:"flex", flexDirection:"column", justifyContent:"center",
            position:"relative", overflow:"hidden",
          }}>
            {/* BG glow */}
            <div style={{ position:"absolute", top:-60, left:-60, width:240, height:240,
              borderRadius:"50%", background:"radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)",
              pointerEvents:"none" }}/>

            <span style={{
              display:"inline-block", background:"rgba(239,68,68,0.15)",
              border:"1px solid rgba(239,68,68,0.4)",
              color:"#ef4444", fontSize:11, fontWeight:800, letterSpacing:1.2,
              padding:"5px 16px", borderRadius:20, marginBottom:20, width:"fit-content",
            }}>🔥 Limited Time Offer</span>

            <h2 style={{
              fontSize:"clamp(30px,3.5vw,50px)", fontWeight:900, color:"#fff",
              lineHeight:1.1, marginBottom:14, letterSpacing:"-0.5px",
            }}>
              Season&apos;s<br/>
              <span style={{ background:"linear-gradient(135deg,#D4A843,#F5C842)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text" }}>Best Price</span>
            </h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:15, lineHeight:1.7, marginBottom:32, maxWidth:300 }}>
              Up to 40% off on fresh juices, seasonal fruits, and organic bundles — this week only!
            </p>
            <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}
                style={{
                  background:"linear-gradient(135deg,#D4A843,#F5C842)",
                  border:"none", borderRadius:12, padding:"14px 30px",
                  fontWeight:800, fontSize:15, cursor:"pointer", color:"#0F0A00",
                  boxShadow:"0 6px 20px rgba(212,168,67,0.4)", transition:"all 0.2s",
                }}
                onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
                Shop the Deal →
              </button>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>
                ⏱ Ends in <strong style={{ color:"#ef4444" }}>2 days</strong>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div style={{ position:"relative", minHeight:300 }}>
            <Image
              src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=900&q=85"
              alt="Fresh juices"
              fill style={{ objectFit:"cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div style={{ position:"absolute", inset:0,
              background:"linear-gradient(to right, rgba(20,14,2,0.6) 0%, transparent 50%)" }}/>

            {/* Price float */}
            <div style={{
              position:"absolute", top:28, right:28,
              background:"rgba(15,10,0,0.85)", backdropFilter:"blur(16px)",
              border:"1px solid rgba(212,168,67,0.3)", borderRadius:16, padding:"14px 20px",
              boxShadow:"0 8px 24px rgba(0,0,0,0.3)",
            }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>Was ৳250</div>
              <div style={{ fontSize:24, fontWeight:900, color:"#22c55e", lineHeight:1 }}>৳150</div>
              <div style={{ fontSize:12, fontWeight:700, color:"#ef4444", marginTop:2 }}>Save 40%</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .promo-grid { grid-template-columns: 1fr !important; }
          .promo-grid > div:last-child { min-height: 220px !important; }
        }
      `}</style>
    </section>
  );
}
