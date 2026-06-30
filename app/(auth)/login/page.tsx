"use client";
import { useState } from "react";
import { signIn } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inp = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12,
    padding: "13px 18px", color: "#fff", fontSize: 15, outline: "none",
    transition: "border-color 0.2s",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const { error: err } = await signIn.email({ email, password,
      callbackURL: "/dashboard" });
    if (err) { setError(err.message || "Login failed"); setLoading(false); }
    else router.push("/dashboard");
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F0A00",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", position: "relative", overflow: "hidden" }}>

      {/* BG glows */}
      <div style={{ position:"absolute", top:-100, left:-100, width:400, height:400, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-100, right:-100, width:350, height:350, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)", pointerEvents:"none" }}/>

      <div style={{ width:"100%", maxWidth:440, position:"relative", zIndex:1 }}>
        {/* Logo */}
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
            Welcome back! Sign in to continue.
          </p>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(24px)",
          WebkitBackdropFilter:"blur(24px)",
          border:"1px solid rgba(255,255,255,0.1)", borderRadius:24,
          padding:"36px 32px",
          boxShadow:"0 32px 64px rgba(0,0,0,0.4)" }}>

          {/* Google */}
          <button onClick={handleGoogle} disabled={googleLoading}
            style={{ width:"100%", background:"rgba(255,255,255,0.07)",
              border:"1px solid rgba(255,255,255,0.12)", borderRadius:12,
              padding:"13px", cursor:"pointer", color:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              fontWeight:600, fontSize:15, marginBottom:24, transition:"all 0.2s" }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(212,168,67,0.4)")}
            onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.12)")}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:13 }}>or</span>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.08)" }}/>
          </div>

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {error && (
              <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)",
                borderRadius:10, padding:"12px 16px", color:"#ef4444", fontSize:13, fontWeight:500 }}>
                ⚠ {error}
              </div>
            )}
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)",
                textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:8 }}>
                Email Address
              </label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@example.com" required style={inp}
                onFocus={e=>(e.target.style.borderColor="#D4A843")}
                onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.12)")}/>
            </div>
            <div>
              <label style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.5)",
                textTransform:"uppercase", letterSpacing:0.8, display:"block", marginBottom:8 }}>
                Password
              </label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="••••••••" required style={inp}
                onFocus={e=>(e.target.style.borderColor="#D4A843")}
                onBlur={e=>(e.target.style.borderColor="rgba(255,255,255,0.12)")}/>
            </div>

            <button type="submit" disabled={loading}
              style={{ marginTop:8, background:"linear-gradient(135deg,#D4A843,#F5C842)",
                border:"none", borderRadius:12, padding:"14px",
                fontWeight:800, fontSize:16, cursor:loading?"not-allowed":"pointer",
                color:"#0F0A00", opacity:loading?0.7:1,
                boxShadow:"0 6px 20px rgba(212,168,67,0.4)", transition:"all 0.2s",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              {loading ? (
                <>
                  <div style={{ width:18, height:18, border:"2px solid rgba(0,0,0,0.3)",
                    borderTopColor:"#0F0A00", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
                  Signing in...
                </>
              ) : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:24, fontSize:14, color:"rgba(255,255,255,0.4)" }}>
            No account?{" "}
            <Link href="/signup" style={{ color:"#D4A843", fontWeight:700, textDecoration:"none" }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
