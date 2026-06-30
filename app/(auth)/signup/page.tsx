"use client";
import { useState } from "react";
import { signUp } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inp = {
    width:"100%", background:"rgba(255,255,255,0.06)",
    border:"1px solid rgba(255,255,255,0.12)", borderRadius:12,
    padding:"13px 18px", color:"#fff", fontSize:15, outline:"none",
    transition:"border-color 0.2s",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }

    const { error: err } = await signUp.email({
      name, email, password, callbackURL: "/dashboard",
    });
    if (err) { setError(err.message || "Signup failed"); setLoading(false); }
    else router.push("/dashboard");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0F0A00",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"24px", position:"relative", overflow:"hidden" }}>

      <div style={{ position:"absolute", top:-100, right:-100, width:400, height:400, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-80, left:-80, width:320, height:320, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ width:"100%", maxWidth:440, position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <Link href="/" style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:10 }}>
            <div style={{ width:48, height:48, background:"linear-gradient(135deg,#D4A843,#F5C842)",
              borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, boxShadow:"0 6px 20px rgba(212,168,67,0.4)" }}>🌿</div>
            <div>
              <span style={{ fontWeight:900, fontSize:26, color:"#fff" }}>Fresh</span>
              <span style={{ fontWeight:900, fontSize:26, color:"#D4A843" }}>Mart</span>
            </div>
          </Link>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginTop:10 }}>
            Join thousands of happy customers!
          </p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(24px)",
          WebkitBackdropFilter:"blur(24px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:24, padding:"36px 32px",
          boxShadow:"0 32px 64px rgba(0,0,0,0.4)" }}>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <h2 style={{ fontSize:22, fontWeight:900, color:"#fff", marginBottom:4, textAlign:"center" }}>
              Create Account
            </h2>

            {error && (
              <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:10, padding:"12px 16px", color:"#ef4444", fontSize:13 }}>
                ⚠ {error}
              </div>
            )}

            {[
              { label:"Full Name", value:name, setter:setName, type:"text", ph:"Your full name" },
              { label:"Email Address", value:email, setter:setEmail, type:"email", ph:"you@example.com" },
              { label:"Password", value:password, setter:setPassword, type:"password", ph:"Min. 6 characters" },
            ].map(({ label, value, setter, type, ph }) => (
              <div key={label}>
                <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)",
                  textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:8 }}>
                  {label}
                </label>
                <input type={type} value={value} onChange={e=>setter(e.target.value)}
                  placeholder={ph} required style={inp}
                  onFocus={e=>(e.target.style.borderColor="#D4A843")}
                  onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.12)")}/>
              </div>
            ))}

            <button type="submit" disabled={loading}
              style={{ marginTop:8, background:"linear-gradient(135deg,#D4A843,#F5C842)",
                border:"none", borderRadius:12, padding:"14px",
                fontWeight:800, fontSize:16, cursor:loading?"not-allowed":"pointer",
                color:"#0F0A00", opacity:loading?0.7:1,
                boxShadow:"0 6px 20px rgba(212,168,67,0.4)",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? (
                <>
                  <div style={{ width:18, height:18, border:"2px solid rgba(0,0,0,0.3)",
                    borderTopColor:"#0F0A00", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                  Creating account...
                </>
              ) : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:"rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color:"#D4A843", fontWeight:700, textDecoration:"none" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
