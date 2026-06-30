"use client";
import Image from "next/image";
import { useState } from "react";

const categories = [
  { id:1, name:"All",        img:"https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80" },
  { id:2, name:"Fruits",     img:"https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&q=80" },
  { id:3, name:"Vegetables", img:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80" },
  { id:4, name:"Nuts & Dry", img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=300&q=80" },
  { id:5, name:"Fresh Juice",img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&q=80" },
  { id:6, name:"Dairy",      img:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80" },
  { id:7, name:"Organic",    img:"https://images.unsplash.com/photo-1518843875459-f738682238a6?w=300&q=80" },
];

interface CategoriesProps { onSelect?: (cat: string) => void; }

export default function Categories({ onSelect }: CategoriesProps) {
  const [active, setActive] = useState("All");

  const handleSelect = (name: string) => {
    setActive(name);
    onSelect?.(name);
    setTimeout(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <section id="categories" style={{ padding:"52px 28px 40px", background:"#0F0A00" }}>
      <div style={{ maxWidth:1280, margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:30 }}>
          <div>
            <p style={{ color:"#D4A843", fontSize:12, fontWeight:700, letterSpacing:1.5,
              textTransform:"uppercase", marginBottom:8 }}>Browse By Category</p>
            <h2 style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>Shop Categories</h2>
          </div>
          <button onClick={() => handleSelect("All")}
            style={{ color:"#D4A843", fontSize:13, fontWeight:600, background:"none",
              border:"1px solid rgba(212,168,67,0.35)", borderRadius:24,
              padding:"8px 20px", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(212,168,67,0.1)")}
            onMouseLeave={e=>(e.currentTarget.style.background="none")}>
            View All →
          </button>
        </div>

        <div style={{ display:"flex", gap:14, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
          {categories.map(cat => {
            const isActive = active === cat.name;
            return (
              <button key={cat.id} onClick={() => handleSelect(cat.name)}
                style={{
                  minWidth:110, flexShrink:0, cursor:"pointer",
                  background: isActive ? "rgba(212,168,67,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isActive ? "rgba(212,168,67,0.6)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius:18, padding:"18px 14px", textAlign:"center",
                  transition:"all 0.25s",
                  transform: isActive ? "translateY(-4px)" : "none",
                  boxShadow: isActive ? "0 8px 24px rgba(212,168,67,0.2)" : "none",
                }}>
                <div style={{ position:"relative", width:68, height:68, margin:"0 auto 12px",
                  borderRadius:"50%", overflow:"hidden",
                  border:`2px solid ${isActive ? "#D4A843" : "rgba(255,255,255,0.1)"}`,
                  boxShadow: isActive ? "0 0 0 3px rgba(212,168,67,0.2)" : "none",
                }}>
                  <Image src={cat.img} alt={cat.name} fill style={{ objectFit:"cover" }} sizes="68px"/>
                </div>
                <div style={{ fontSize:13, fontWeight:700,
                  color: isActive ? "#D4A843" : "rgba(255,255,255,0.7)" }}>
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
