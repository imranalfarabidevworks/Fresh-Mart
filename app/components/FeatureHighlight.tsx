"use client";
import Image from "next/image";

const features = [
  { icon:"🚚", title:"Free Delivery", desc:"Orders above ৳500 delivered free" },
  { icon:"🌿", title:"100% Organic",  desc:"Certified pesticide-free produce" },
  { icon:"⚡", title:"Same Day",      desc:"Order before 2PM, get by evening" },
  { icon:"↩️", title:"Easy Returns",  desc:"Not happy? Full refund guaranteed" },
];

export default function FeatureHighlight() {
  return (
    <>
      {/* Feature row */}
      <section style={{ padding:"48px 28px", background:"#0F0A00" }}>
        <div style={{ maxWidth:1280, margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }} className="feat-grid">
          {features.map(f => (
            <div key={f.title}
              style={{
                background:"rgba(255,255,255,0.04)", backdropFilter:"blur(12px)",
                border:"1px solid rgba(255,255,255,0.07)", borderRadius:18,
                padding:"24px 20px", transition:"all 0.25s", cursor:"default",
              }}
              onMouseEnter={e=>{(e.currentTarget.style.borderColor="rgba(212,168,67,0.35)");(e.currentTarget.style.background="rgba(212,168,67,0.06)");(e.currentTarget.style.transform="translateY(-3px)");}}
              onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)");(e.currentTarget.style.background="rgba(255,255,255,0.04)");(e.currentTarget.style.transform="none");}}>
              <div style={{ fontSize:34, marginBottom:14 }}>{f.icon}</div>
              <h4 style={{ fontSize:15, fontWeight:800, color:"#fff", marginBottom:6 }}>{f.title}</h4>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story section */}
      <section style={{ padding:"0 28px 64px", background:"#0F0A00" }}>
        <div style={{
          maxWidth:1280, margin:"0 auto",
          background:"rgba(255,255,255,0.03)", backdropFilter:"blur(12px)",
          border:"1px solid rgba(255,255,255,0.07)", borderRadius:28,
          overflow:"hidden",
          display:"grid", gridTemplateColumns:"1fr 1fr",
        }} className="story-grid">
          {/* Image side */}
          <div style={{ position:"relative", minHeight:420 }}>
            <Image
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=900&q=85"
              alt="Organic market"
              fill style={{ objectFit:"cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div style={{ position:"absolute", inset:0,
              background:"linear-gradient(to right, transparent 60%, rgba(15,10,0,0.8) 100%)" }}/>

            {/* Badge */}
            <div style={{
              position:"absolute", bottom:28, left:28,
              background:"rgba(15,10,2,0.8)", backdropFilter:"blur(16px)",
              border:"1px solid rgba(212,168,67,0.25)", borderRadius:16, padding:"14px 20px",
              display:"flex", alignItems:"center", gap:12,
            }}>
              <div style={{ width:44, height:44, borderRadius:"50%", overflow:"hidden", position:"relative",
                border:"2px solid rgba(212,168,67,0.4)", flexShrink:0 }}>
                <Image src="https://images.unsplash.com/photo-1559181567-c3190ca9d222?w=100&q=80"
                  alt="farmer" fill style={{objectFit:"cover"}} sizes="44px"/>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Direct from Farmers</div>
                <div style={{ fontSize:12, color:"#22c55e", fontWeight:600 }}>✓ 50+ Partner Farms</div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div style={{ padding:"48px 44px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <p style={{ color:"#D4A843", fontSize:12, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:14 }}>Our Story</p>
            <h2 style={{ fontSize:"clamp(28px,3vw,40px)", fontWeight:900, color:"#fff",
              lineHeight:1.15, marginBottom:20, letterSpacing:"-0.5px" }}>
              Farm-Fresh to<br/>
              <span style={{ background:"linear-gradient(135deg,#D4A843,#F5C842)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text" }}>Your Doorstep</span>
            </h2>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:15, lineHeight:1.85, marginBottom:28 }}>
              Every product we carry is sourced from certified organic farms across Bangladesh.
              Fresh, wholesome food that nourishes your family — free from pesticides and artificial additives.
            </p>
            <div style={{ display:"flex", gap:24, marginBottom:32, flexWrap:"wrap" }}>
              {[["50+","Partner Farms"],["100%","Organic Certified"],["24h","Fresh Stock"]].map(([v,l])=>(
                <div key={l} style={{ borderLeft:"3px solid #D4A843", paddingLeft:14 }}>
                  <div style={{ fontSize:22, fontWeight:900, color:"#D4A843" }}>{v}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>{l}</div>
                </div>
              ))}
            </div>
            <button style={{
              background:"linear-gradient(135deg,#D4A843,#F5C842)",
              border:"none", borderRadius:12, padding:"13px 28px",
              fontWeight:800, fontSize:14, cursor:"pointer", color:"#0F0A00",
              width:"fit-content", transition:"all 0.2s",
              boxShadow:"0 4px 16px rgba(212,168,67,0.3)",
            }}
              onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-2px)")}
              onMouseLeave={e=>(e.currentTarget.style.transform="none")}>
              Learn Our Story →
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: repeat(2,1fr) !important; }
          .story-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
