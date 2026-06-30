"use client";
import Image from "next/image";

const testimonials = [
  { id:1, name:"Fatima Begum",  role:"Weekly Subscriber", rating:5,
    text:"Freshest fruits I have ever ordered. The berries were absolutely perfect and arrived on time!",
    avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
  { id:2, name:"Rahim Uddin",   role:"Regular Customer", rating:5,
    text:"Great prices and super fast delivery. The organic nuts are my whole family's favourite snack.",
    avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
  { id:3, name:"Nusrat Jahan",  role:"FreshMart Member", rating:5,
    text:"Been ordering for 6 months — the quality is always consistent and delivery is always on time!",
    avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80" },
];

export default function StatsSection() {
  return (
    <>
      {/* Stats bar */}
      <section style={{ background:"rgba(255,255,255,0.03)", borderTop:"1px solid rgba(255,255,255,0.06)",
        borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"40px 28px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0 }} className="stats-grid">
          {[
            { value:"2,500+", label:"Happy Customers", icon:"😊" },
            { value:"150+",   label:"Fresh Products",  icon:"🥗" },
            { value:"4.9★",   label:"Average Rating",  icon:"⭐" },
            { value:"1 Hour", label:"Avg Delivery",    icon:"🚀" },
          ].map((s,i) => (
            <div key={s.label} style={{
              padding:"20px 24px", textAlign:"center",
              borderRight: i<3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:34, fontWeight:900, color:"#D4A843", marginBottom:4,
                background:"linear-gradient(135deg,#D4A843,#F5C842)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                backgroundClip:"text" }}>{s.value}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background:"#0F0A00", padding:"64px 28px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <p style={{ color:"#D4A843", fontSize:12, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:10 }}>Testimonials</p>
            <h2 style={{ fontSize:34, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>
              What Our Customers Say
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }} className="testi-grid">
            {testimonials.map(t => (
              <div key={t.id} style={{
                background:"rgba(255,255,255,0.04)", backdropFilter:"blur(16px)",
                WebkitBackdropFilter:"blur(16px)",
                border:"1px solid rgba(255,255,255,0.07)", borderRadius:20,
                padding:"30px 26px", position:"relative", overflow:"hidden",
                transition:"all 0.25s",
              }}
                onMouseEnter={e=>{(e.currentTarget.style.borderColor="rgba(212,168,67,0.3)");(e.currentTarget.style.transform="translateY(-4px)");}}
                onMouseLeave={e=>{(e.currentTarget.style.borderColor="rgba(255,255,255,0.07)");(e.currentTarget.style.transform="none");}}>

                {/* Gold top accent */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:"linear-gradient(90deg, #D4A843, #F5C842)" }}/>

                <div style={{ fontSize:44, color:"rgba(212,168,67,0.3)", lineHeight:1, marginBottom:14,
                  fontFamily:"Georgia,serif" }}>&ldquo;</div>
                <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14, lineHeight:1.8, marginBottom:22 }}>
                  {t.text}
                </p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:48, height:48, borderRadius:"50%", overflow:"hidden",
                    position:"relative", flexShrink:0, border:"2px solid rgba(212,168,67,0.3)" }}>
                    <Image src={t.avatar} alt={t.name} fill style={{objectFit:"cover"}} sizes="48px"/>
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>{t.role}</div>
                    <div style={{ color:"#D4A843", fontSize:13, marginTop:2 }}>{"★".repeat(t.rating)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
            .testi-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
    </>
  );
}
