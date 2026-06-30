"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section style={{
      position: "relative", minHeight: 600,
      background: "linear-gradient(160deg, #1A1200 0%, #0F0A00 50%, #1A0F00 100%)",
      overflow: "hidden",
    }}>
      {/* Background blurred blobs */}
      <div style={{ position:"absolute", top:-120, right:-80, width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(212,168,67,0.18) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-100, left:-60, width:400, height:400, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"30%", left:"40%", width:300, height:300, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 28px",
        display:"flex", alignItems:"center", minHeight:600, gap:48, position:"relative", zIndex:1 }}>

        {/* Left */}
        <div style={{ flex:1, paddingTop:32, paddingBottom:80 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(212,168,67,0.12)", border:"1px solid rgba(212,168,67,0.3)",
            borderRadius:30, padding:"7px 16px", marginBottom:24,
          }}>
            <span style={{ width:6,height:6,borderRadius:"50%",background:"#D4A843", display:"inline-block", animation:"pulse 2s infinite" }}/>
            <span style={{ fontSize:12, fontWeight:600, color:"#D4A843", letterSpacing:0.8 }}>Fresh delivery daily across Bangladesh</span>
          </div>

          <h1 style={{
            fontSize:"clamp(40px,5.5vw,72px)", fontWeight:900, lineHeight:1.05,
            color:"#fff", marginBottom:24, maxWidth:520, letterSpacing:"-1.5px",
          }}>
            Discover<br/>
            <span style={{
              background:"linear-gradient(135deg, #D4A843, #F5C842, #D4A843)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              backgroundClip:"text",
            }}>Nature&apos;s Finest</span><br/>
            <span style={{ color:"rgba(255,255,255,0.85)" }}>Flavors</span>
          </h1>

          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:16, lineHeight:1.8,
            marginBottom:36, maxWidth:400 }}>
            Handpicked organic fruits, nuts & produce — delivered fresh from certified farms to your doorstep within hours.
          </p>

          <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:44 }}>
            <button onClick={() => document.getElementById("products")?.scrollIntoView({behavior:"smooth"})}
              style={{
                background:"linear-gradient(135deg, #D4A843, #F5C842)",
                border:"none", borderRadius:14, padding:"15px 36px",
                fontWeight:800, fontSize:16, cursor:"pointer", color:"#0F0A00",
                boxShadow:"0 8px 24px rgba(212,168,67,0.4)", transition:"all 0.25s",
              }}
              onMouseEnter={e=>{(e.currentTarget.style.transform="translateY(-2px)");(e.currentTarget.style.boxShadow="0 14px 32px rgba(212,168,67,0.5)");}}
              onMouseLeave={e=>{(e.currentTarget.style.transform="translateY(0)");(e.currentTarget.style.boxShadow="0 8px 24px rgba(212,168,67,0.4)");}}
            >Shop Now →</button>

            <button onClick={() => document.getElementById("categories")?.scrollIntoView({behavior:"smooth"})}
              style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)",
                borderRadius:14, padding:"15px 28px", fontWeight:600, fontSize:15,
                cursor:"pointer", color:"rgba(255,255,255,0.8)",
                backdropFilter:"blur(10px)", transition:"all 0.2s",
              }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(212,168,67,0.5)")}
              onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.15)")}
            >View Categories</button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)", borderRadius:16,
            overflow:"hidden", width:"fit-content" }}>
            {[["500+","Products"],["2k+","Customers"],["1hr","Delivery"],["4.9★","Rating"]].map(([v,l],i)=>(
              <div key={l} style={{
                padding:"16px 24px", textAlign:"center",
                borderRight: i<3 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                <div style={{ fontSize:20, fontWeight:900, color:"#D4A843" }}>{v}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)", marginTop:3, fontWeight:500 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div style={{ flex:1, display:"flex", justifyContent:"center", alignItems:"center",
          position:"relative", paddingBottom:60 }} className="hero-right">

          {/* Glow */}
          <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(212,168,67,0.25) 0%, transparent 65%)",
            top:"50%", left:"50%", transform:"translate(-50%,-55%)" }}/>

          {/* Main image */}
          <div style={{ position:"relative", width:"100%", maxWidth:440, zIndex:1 }}>
            <Image
              src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=900&q=90"
              alt="Fresh mixed berries bowl"
              width={440} height={400}
              style={{ width:"100%", height:"auto", objectFit:"cover",
                borderRadius:"50% 50% 38% 38% / 58% 58% 42% 42%",
                boxShadow:"0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,168,67,0.2)",
              }}
              priority
            />
          </div>

          {/* Floating cards */}
          <div style={{
            position:"absolute", bottom:90, left:-20, zIndex:2,
            background:"rgba(20,14,2,0.8)", backdropFilter:"blur(20px)",
            border:"1px solid rgba(212,168,67,0.25)",
            borderRadius:16, padding:"12px 18px",
            display:"flex", alignItems:"center", gap:12,
            boxShadow:"0 8px 24px rgba(0,0,0,0.3)",
          }}>
            <span style={{ fontSize:28 }}>🍓</span>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:"#fff" }}>Strawberries</div>
              <div style={{ fontSize:11, color:"#22c55e", fontWeight:600 }}>✓ Freshly Picked</div>
            </div>
          </div>

          <div style={{
            position:"absolute", top:60, right:-10, zIndex:2,
            background:"rgba(20,14,2,0.8)", backdropFilter:"blur(20px)",
            border:"1px solid rgba(212,168,67,0.25)",
            borderRadius:14, padding:"12px 18px",
            boxShadow:"0 8px 24px rgba(0,0,0,0.3)",
          }}>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>Today&apos;s Deal</div>
            <div style={{ fontSize:22, fontWeight:900, color:"#D4A843", lineHeight:1 }}>40% OFF</div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>Selected items</div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div style={{ position:"absolute", bottom:-2, left:0, right:0, height:70,
        background:"#0F0A00", clipPath:"ellipse(54% 100% at 50% 100%)", zIndex:2 }}/>

      <style>{`
        @media (max-width: 768px) { .hero-right { display: none !important; } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
      `}</style>
    </section>
  );
}
