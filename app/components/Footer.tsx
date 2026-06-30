"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{
      background:"rgba(8,5,0,0.98)", backdropFilter:"blur(12px)",
      borderTop:"1px solid rgba(212,168,67,0.15)", color:"rgba(255,255,255,0.5)",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"56px 28px 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:44 }}
          className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:40, height:40, background:"linear-gradient(135deg,#D4A843,#F5C842)",
                borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🌿</div>
              <div>
                <span style={{ fontWeight:900, fontSize:22, color:"#fff" }}>Fresh</span>
                <span style={{ fontWeight:900, fontSize:22, color:"#D4A843" }}>Mart</span>
              </div>
            </div>
            <p style={{ fontSize:14, lineHeight:1.85, color:"rgba(255,255,255,0.4)", maxWidth:260, marginBottom:24 }}>
              Your trusted source for fresh organic produce — delivered from local farms to your table every day.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {["f","ig","𝕏"].map((s,i) => (
                <a key={i} href="#"
                  style={{ width:36, height:36, background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,255,255,0.1)", borderRadius:"50%", fontSize:12, fontWeight:700,
                    textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center",
                    color:"rgba(255,255,255,0.5)", transition:"all 0.2s" }}
                  onMouseEnter={e=>{(e.currentTarget.style.background="rgba(212,168,67,0.2)");(e.currentTarget.style.borderColor="rgba(212,168,67,0.4)");(e.currentTarget.style.color="#D4A843");}}
                  onMouseLeave={e=>{(e.currentTarget.style.background="rgba(255,255,255,0.06)");(e.currentTarget.style.borderColor="rgba(255,255,255,0.1)");(e.currentTarget.style.color="rgba(255,255,255,0.5)");}}>
                  {s}
                </a>
              ))}
            </div>
          </div>

          {[
            { heading:"Shop", links:["Fruits","Vegetables","Nuts & Dry","Fresh Juice","Dairy"] },
            { heading:"Company", links:["About Us","Blog","Careers","Press"] },
            { heading:"Support", links:["FAQ","Track Order","Contact Us","Returns"] },
          ].map(col => (
            <div key={col.heading}>
              <h4 style={{ color:"#fff", fontWeight:700, fontSize:15, marginBottom:18, letterSpacing:"-0.2px" }}>
                {col.heading}
              </h4>
              <ul style={{ listStyle:"none", padding:0, margin:0 }}>
                {col.links.map(link => (
                  <li key={link} style={{ marginBottom:12 }}>
                    <Link href="#"
                      style={{ color:"rgba(255,255,255,0.4)", textDecoration:"none",
                        fontSize:14, transition:"color 0.2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#D4A843")}
                      onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.4)")}>
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ display:"flex", gap:28, flexWrap:"wrap", padding:"20px 0",
          borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:24 }}>
          {[["📍","Dhaka, Bangladesh"],["📞","+880 1700-000000"],["✉️","hello@freshmart.com"],["🕐","Sat–Thu: 8AM–10PM"]].map(([icon,text])=>(
            <div key={text} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span>{icon}</span>
              <span style={{ fontSize:13 }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:13 }}>© 2025 FreshMart. All rights reserved.</p>
          <div style={{ display:"flex", gap:20 }}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(item=>(
              <Link key={item} href="#"
                style={{ color:"rgba(255,255,255,0.35)", fontSize:13, textDecoration:"none", transition:"color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#D4A843")}
                onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.35)")}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
