"use client";
import { useState, useRef } from "react";
import { signUp, authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageName, setImageName] = useState<string>("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const inp = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    padding: "13px 18px",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
  };

  // ইমেজ ফাইল হ্যান্ডেল এবং Base64 এ কনভার্ট করার ফাংশন
  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // এটি Base64 স্ট্রিং হিসেবে ইমেজ সেট করবে
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  // ড্র্যাগ অ্যান্ড ড্রপ ইভেন্ট হ্যান্ডলার
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error: err } = await signUp.email({
      name,
      email,
      password,
      image: imagePreview || undefined, // এখানে Base64 ইমেজ স্ট্রিংটি পাস করা হলো
      callbackURL: "/dashboard",
    });

    if (err) {
      setError(err.message || "Signup failed");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Google signup failed";
      setError(errorMessage);
      setGoogleLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 48, height: 48, background: "linear-gradient(135deg,#D4A843,#F5C842)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 6px 20px rgba(212,168,67,0.4)" }}>🌿</div>
            <div>
              <span style={{ fontWeight: 900, fontSize: 26, color: "#fff" }}>Fresh</span>
              <span style={{ fontWeight: 900, fontSize: 26, color: "#D4A843" }}>Mart</span>
            </div>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 10 }}>Join thousands of happy customers!</p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 2, textAlign: "center" }}>Create Account</h2>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "12px 16px", color: "#ef4444", fontSize: 13 }}>
                ⚠ {error}
              </div>
            )}

            {/* Profile Picture Upload Zone */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 8 }}>Profile Picture</label>
              <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} accept="image/*" style={{ display: "none" }} />
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  height: 110,
                  border: isDragActive ? "2px dashed #D4A843" : "1px dashed rgba(255,255,255,0.2)",
                  background: isDragActive ? "rgba(212,168,67,0.05)" : "rgba(255,255,255,0.02)",
                  borderRadius: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {imagePreview ? (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 16px" }}>
                    <img src={imagePreview} alt="Preview" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "2px solid #D4A843" }} />
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <p style={{ color: "#fff", fontSize: 14, margin: 0, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{imageName}</p>
                      <button type="button" onClick={removeImage} style={{ background: "none", border: "none", color: "#ef4444", padding: 0, fontSize: 12, cursor: "pointer", fontWeight: 700, marginTop: 4 }}>Remove Image ✕</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span style={{ fontSize: 24, marginBottom: 4 }}>📸</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>Drag & drop your picture here or <span style={{ color: "#D4A843", fontWeight: 700 }}>Browse</span></span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 2 }}>Supports: JPG, PNG, WEBP</span>
                  </>
                )}
              </div>
            </div>

            {[
              { label: "Full Name", value: name, setter: setName, type: "text", ph: "Your full name" },
              { label: "Email Address", value: email, setter: setEmail, type: "email", ph: "you@example.com" },
              { label: "Password", value: password, setter: setPassword, type: "password", ph: "Min. 6 characters" },
            ].map(({ label, value, setter, type, ph }) => (
              <div key={label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>{label}</label>
                <input 
                  type={type} 
                  value={value} 
                  onChange={(e) => setter(e.target.value)} 
                  placeholder={ph} 
                  required 
                  style={inp} 
                  onFocus={(e) => { e.target.style.borderColor = "#D4A843"; }} 
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }} 
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading || googleLoading}
              style={{
                marginTop: 6,
                background: "linear-gradient(135deg,#D4A843,#F5C842)",
                border: "none",
                borderRadius: 12,
                padding: "14px",
                fontWeight: 800,
                fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer",
                color: "#0F0A00",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 6px 20px rgba(212,168,67,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#0F0A00", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Creating account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "18px 0", gap: 10 }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textTransform: "uppercase" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
          </div>

          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={handleGoogleSignup}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: "14px",
              fontWeight: 700,
              fontSize: 15,
              cursor: googleLoading ? "not-allowed" : "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            {googleLoading ? (
              <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            ) : (
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: 20, height: 20 }} />
            )}
            <span>Continue with Google</span>
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#D4A843", fontWeight: 700, textDecoration: "none" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}