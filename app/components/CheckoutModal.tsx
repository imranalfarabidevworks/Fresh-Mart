"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useSession } from "../lib/auth-client";
import { useToast } from "../context/ToastContext";

type Step = "address" | "payment" | "confirm" | "success";

interface OrderForm {
  name: string; phone: string; address: string; city: string;
  payMethod: "bkash" | "nagad" | "card" | "cod";
  bkashNum: string; nagadNum: string;
  cardNum: string; cardExp: string; cardCvv: string;
  transId: string;
}

const inp = {
  width:"100%", background:"rgba(255,255,255,0.06)",
  border:"1px solid rgba(255,255,255,0.12)", borderRadius:10,
  padding:"12px 16px", color:"#fff", fontSize:14, outline:"none",
  transition:"border-color 0.2s",
};

export default function CheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, total, clearCart } = useCart();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [step, setStep] = useState<Step>("address");
  const [form, setForm] = useState<OrderForm>({
    name: session?.user?.name ?? "",
    phone:"", address:"", city:"",
    payMethod:"bkash",
    bkashNum:"", nagadNum:"",
    cardNum:"", cardExp:"", cardCvv:"", transId:"",
  });
  const [errors, setErrors] = useState<Partial<OrderForm>>({});
  const [loading, setLoading] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");

  const delivery = total >= 500 ? 0 : 60;
  const grandTotal = total + delivery;

  const set = (k: keyof OrderForm, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validateAddress = () => {
    const e: Partial<OrderForm> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^01[3-9]\d{8}$/.test(form.phone)) e.phone = "Valid BD number (01XXXXXXXXX)";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Partial<OrderForm> = {};
    if (form.payMethod === "bkash") {
      if (!/^01[3-9]\d{8}$/.test(form.bkashNum)) e.bkashNum = "Valid bKash number required";
      if (!form.transId.trim()) e.transId = "Transaction ID required";
    } else if (form.payMethod === "nagad") {
      if (!/^01[3-9]\d{8}$/.test(form.nagadNum)) e.nagadNum = "Valid Nagad number required";
      if (!form.transId.trim()) e.transId = "Transaction ID required";
    } else if (form.payMethod === "card") {
      if (form.cardNum.replace(/\s/g,"").length < 16) e.cardNum = "Valid 16-digit card number";
      if (!form.cardExp.trim()) e.cardExp = "Required";
      if (form.cardCvv.length < 3) e.cardCvv = "3 digits required";
    }
    setErrors(e); return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!session?.user) {
      showToast("Please sign in to place an order", "error");
      onClose();
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(c => ({
            productId: c.id, name: c.name,
            price: c.price, quantity: c.quantity,
            img: c.img, unit: c.unit,
          })),
          subtotal: total,
          delivery,
          total: grandTotal,
          paymentMethod: form.payMethod,
          paymentTransactionId: form.transId || form.bkashNum || form.nagadNum || null,
          deliveryAddress: {
            name: form.name, phone: form.phone,
            address: form.address, city: form.city,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      setPlacedOrderId(data.orderId);
      clearCart();
      setStep("success");
      showToast("Order placed successfully! 🎉", "success");
    } catch (err) {
      showToast((err as Error).message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("address");
    setForm({ name:session?.user?.name??"", phone:"", address:"", city:"",
      payMethod:"bkash", bkashNum:"", nagadNum:"",
      cardNum:"", cardExp:"", cardCvv:"", transId:"" });
    setErrors({});
    onClose();
  };

  if (!open) return null;

  const stepLabels: { key: Step; label: string }[] = [
    { key:"address", label:"Delivery" },
    { key:"payment", label:"Payment" },
    { key:"confirm", label:"Confirm" },
  ];
  const stepOrder: Step[] = ["address","payment","confirm"];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:400,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={reset} style={{ position:"absolute", inset:0,
        background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)" }}/>

      <div style={{
        position:"relative", width:"100%", maxWidth:540,
        maxHeight:"90vh", overflowY:"auto",
        background:"rgba(18,12,1,0.97)", backdropFilter:"blur(30px)",
        border:"1px solid rgba(212,168,67,0.3)", borderRadius:24,
        margin:"0 16px",
        boxShadow:"0 48px 96px rgba(0,0,0,0.7)",
        animation:"slideUp 0.35s ease",
      }}>
        {/* Header */}
        <div style={{ padding:"28px 28px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: step==="success" ? 0 : 20 }}>
            <h2 style={{ fontSize:22, fontWeight:900, color:"#fff" }}>
              {step==="success" ? "Order Placed! 🎉" : "Checkout"}
            </h2>
            <button onClick={reset}
              style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, width:36, height:36, cursor:"pointer",
                color:"rgba(255,255,255,0.6)", fontSize:16,
                display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>

          {/* Step indicators */}
          {step !== "success" && (
            <div style={{ display:"flex", alignItems:"center" }}>
              {stepLabels.map((s, i) => {
                const isActive = s.key === step;
                const isDone = stepOrder.indexOf(s.key) < currentIdx;
                return (
                  <div key={s.key} style={{ display:"flex", alignItems:"center", flex:1 }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
                      <div style={{
                        width:30, height:30, borderRadius:"50%",
                        background: isDone?"#22c55e" : isActive?"#D4A843" : "rgba(255,255,255,0.08)",
                        border:`2px solid ${isDone?"#22c55e" : isActive?"#D4A843" : "rgba(255,255,255,0.12)"}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:12, fontWeight:800, transition:"all 0.3s",
                        color: isDone?"#fff" : isActive?"#0F0A00" : "rgba(255,255,255,0.35)",
                      }}>{isDone ? "✓" : i+1}</div>
                      <span style={{ fontSize:11, marginTop:4, fontWeight:isActive?700:500,
                        color: isActive?"#D4A843" : isDone?"#22c55e" : "rgba(255,255,255,0.35)" }}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && <div style={{ height:2, flex:1, margin:"0 4px", marginBottom:18,
                      background: isDone?"#22c55e":"rgba(255,255,255,0.07)",
                      transition:"background 0.3s" }}/>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding:"24px 28px 28px" }}>

          {/* ── STEP 1: ADDRESS ── */}
          {step === "address" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {!session?.user && (
                <div style={{ background:"rgba(212,168,67,0.1)", border:"1px solid rgba(212,168,67,0.3)",
                  borderRadius:12, padding:"12px 16px", fontSize:13 }}>
                  <span style={{ color:"#D4A843" }}>ℹ </span>
                  <span style={{ color:"rgba(255,255,255,0.7)" }}>
                    <a href="/login" style={{ color:"#D4A843", fontWeight:700 }}>Sign in</a> to track your orders in your dashboard.
                  </span>
                </div>
              )}
              <h3 style={{ fontSize:15, fontWeight:700, color:"#D4A843", marginBottom:4 }}>📍 Delivery Information</h3>
              {[
                { key:"name" as keyof OrderForm, label:"Full Name", ph:"Your full name" },
                { key:"phone" as keyof OrderForm, label:"Phone Number", ph:"01XXXXXXXXX" },
                { key:"address" as keyof OrderForm, label:"Delivery Address", ph:"House, Road, Area" },
                { key:"city" as keyof OrderForm, label:"City", ph:"Dhaka, Chattogram, Sylhet..." },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.45)",
                    letterSpacing:"0.5px", textTransform:"uppercase", display:"block", marginBottom:6 }}>
                    {label}
                  </label>
                  <input value={form[key]} onChange={e=>set(key, e.target.value)}
                    placeholder={ph}
                    style={{ ...inp, borderColor:errors[key]?"#ef4444":"rgba(255,255,255,0.12)" }}
                    onFocus={e=>(e.target.style.borderColor="#D4A843")}
                    onBlur={e=>(e.target.style.borderColor=errors[key]?"#ef4444":"rgba(255,255,255,0.12)")}/>
                  {errors[key] && <p style={{ color:"#ef4444", fontSize:11, marginTop:4 }}>{errors[key]}</p>}
                </div>
              ))}
              <button onClick={()=>{ if(validateAddress()) setStep("payment"); }}
                style={{ marginTop:8, background:"linear-gradient(135deg,#D4A843,#F5C842)",
                  border:"none", borderRadius:12, padding:"14px", fontWeight:800,
                  fontSize:15, cursor:"pointer", color:"#0F0A00",
                  boxShadow:"0 4px 16px rgba(212,168,67,0.35)" }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === "payment" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#D4A843" }}>💳 Payment Method</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {[
                  { key:"bkash" as const, label:"bKash",  emoji:"📱", accent:"#E2136E" },
                  { key:"nagad" as const, label:"Nagad",  emoji:"📲", accent:"#F26522" },
                  { key:"card"  as const, label:"Card",   emoji:"💳", accent:"#6366f1" },
                  { key:"cod"   as const, label:"Cash",   emoji:"💵", accent:"#22c55e" },
                ].map(p => (
                  <button key={p.key} onClick={()=>set("payMethod", p.key)}
                    style={{
                      background: form.payMethod===p.key ? `${p.accent}18` : "rgba(255,255,255,0.04)",
                      border:`2px solid ${form.payMethod===p.key ? p.accent : "rgba(255,255,255,0.08)"}`,
                      borderRadius:12, padding:"12px 8px", cursor:"pointer",
                      transition:"all 0.2s",
                    }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{p.emoji}</div>
                    <div style={{ fontSize:11, fontWeight:700,
                      color: form.payMethod===p.key ? p.accent : "rgba(255,255,255,0.5)" }}>
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* bKash */}
              {form.payMethod === "bkash" && (
                <div style={{ background:"rgba(226,19,110,0.07)", border:"1px solid rgba(226,19,110,0.22)",
                  borderRadius:14, padding:16 }}>
                  <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginBottom:14 }}>
                    📱 Send <strong style={{ color:"#E2136E" }}>৳{grandTotal}</strong> to{" "}
                    <strong style={{ color:"#fff" }}>01712-345678</strong> (bKash Merchant)
                  </p>
                  {[
                    { key:"bkashNum" as keyof OrderForm, label:"Your bKash Number", ph:"01XXXXXXXXX" },
                    { key:"transId"  as keyof OrderForm, label:"Transaction ID (TrxID)", ph:"8-character TrxID" },
                  ].map(f=>(
                    <div key={f.key} style={{ marginBottom:10 }}>
                      <label style={{ fontSize:11, color:"rgba(255,255,255,0.45)", display:"block",
                        marginBottom:5, textTransform:"uppercase" }}>{f.label}</label>
                      <input value={form[f.key]} onChange={e=>set(f.key,e.target.value)} placeholder={f.ph}
                        style={{ ...inp, borderColor:errors[f.key]?"#ef4444":"rgba(226,19,110,0.22)" }}/>
                      {errors[f.key] && <p style={{ color:"#ef4444", fontSize:11, marginTop:3 }}>{errors[f.key]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Nagad */}
              {form.payMethod === "nagad" && (
                <div style={{ background:"rgba(242,101,34,0.07)", border:"1px solid rgba(242,101,34,0.22)",
                  borderRadius:14, padding:16 }}>
                  <p style={{ color:"rgba(255,255,255,0.65)", fontSize:13, marginBottom:14 }}>
                    📲 Send <strong style={{ color:"#F26522" }}>৳{grandTotal}</strong> to{" "}
                    <strong style={{ color:"#fff" }}>01911-345678</strong> (Nagad Merchant)
                  </p>
                  {[
                    { key:"nagadNum" as keyof OrderForm, label:"Your Nagad Number", ph:"01XXXXXXXXX" },
                    { key:"transId"  as keyof OrderForm, label:"Transaction ID", ph:"TrxID from Nagad" },
                  ].map(f=>(
                    <div key={f.key} style={{ marginBottom:10 }}>
                      <label style={{ fontSize:11, color:"rgba(255,255,255,0.45)", display:"block",
                        marginBottom:5, textTransform:"uppercase" }}>{f.label}</label>
                      <input value={form[f.key]} onChange={e=>set(f.key,e.target.value)} placeholder={f.ph}
                        style={{ ...inp, borderColor:errors[f.key]?"#ef4444":"rgba(242,101,34,0.22)" }}/>
                      {errors[f.key] && <p style={{ color:"#ef4444", fontSize:11, marginTop:3 }}>{errors[f.key]}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Card */}
              {form.payMethod === "card" && (
                <div style={{ background:"rgba(99,102,241,0.07)", border:"1px solid rgba(99,102,241,0.22)",
                  borderRadius:14, padding:16 }}>
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:11, color:"rgba(255,255,255,0.45)", display:"block",
                      marginBottom:5, textTransform:"uppercase" }}>Card Number</label>
                    <input value={form.cardNum}
                      onChange={e=>set("cardNum", e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19))}
                      placeholder="1234 5678 9012 3456" maxLength={19}
                      style={{ ...inp, borderColor:errors.cardNum?"#ef4444":"rgba(99,102,241,0.25)",
                        fontFamily:"monospace", letterSpacing:2 }}/>
                    {errors.cardNum && <p style={{ color:"#ef4444", fontSize:11, marginTop:3 }}>{errors.cardNum}</p>}
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <div>
                      <label style={{ fontSize:11, color:"rgba(255,255,255,0.45)", display:"block",
                        marginBottom:5, textTransform:"uppercase" }}>Expiry (MM/YY)</label>
                      <input value={form.cardExp}
                        onChange={e=>set("cardExp", e.target.value.replace(/[^\d/]/g,"").slice(0,5))}
                        placeholder="MM/YY" maxLength={5}
                        style={{ ...inp, borderColor:errors.cardExp?"#ef4444":"rgba(99,102,241,0.25)" }}/>
                    </div>
                    <div>
                      <label style={{ fontSize:11, color:"rgba(255,255,255,0.45)", display:"block",
                        marginBottom:5, textTransform:"uppercase" }}>CVV</label>
                      <input value={form.cardCvv}
                        onChange={e=>set("cardCvv", e.target.value.replace(/\D/g,"").slice(0,3))}
                        placeholder="•••" maxLength={3} type="password"
                        style={{ ...inp, borderColor:errors.cardCvv?"#ef4444":"rgba(99,102,241,0.25)" }}/>
                    </div>
                  </div>
                </div>
              )}

              {/* COD */}
              {form.payMethod === "cod" && (
                <div style={{ background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.22)",
                  borderRadius:14, padding:16, textAlign:"center" }}>
                  <div style={{ fontSize:38, marginBottom:8 }}>💵</div>
                  <p style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>
                    Pay <strong style={{ color:"#22c55e" }}>৳{grandTotal}</strong> in cash when your order arrives.
                  </p>
                  <p style={{ color:"rgba(255,255,255,0.35)", fontSize:12, marginTop:6 }}>
                    Please keep exact change ready for the delivery person.
                  </p>
                </div>
              )}

              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <button onClick={()=>setStep("address")}
                  style={{ flex:1, background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(255,255,255,0.1)", borderRadius:12,
                    padding:"13px", fontWeight:700, fontSize:14, cursor:"pointer",
                    color:"rgba(255,255,255,0.65)" }}>
                  ← Back
                </button>
                <button onClick={()=>{ if(validatePayment()) setStep("confirm"); }}
                  style={{ flex:2, background:"linear-gradient(135deg,#D4A843,#F5C842)",
                    border:"none", borderRadius:12, padding:"13px",
                    fontWeight:800, fontSize:15, cursor:"pointer", color:"#0F0A00" }}>
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: CONFIRM ── */}
          {step === "confirm" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <h3 style={{ fontSize:15, fontWeight:700, color:"#D4A843" }}>📦 Order Summary</h3>

              {/* Address */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase",
                  letterSpacing:0.5, marginBottom:8 }}>Delivering To</p>
                <p style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{form.name}</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:2 }}>{form.phone}</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.55)", marginTop:2 }}>
                  {form.address}, {form.city}
                </p>
              </div>

              {/* Payment method */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase",
                  letterSpacing:0.5, marginBottom:8 }}>Payment</p>
                <p style={{ fontSize:14, fontWeight:700, color:"#fff" }}>
                  {form.payMethod==="bkash" ? "📱 bKash"
                    : form.payMethod==="nagad" ? "📲 Nagad"
                    : form.payMethod==="card"  ? "💳 Card"
                    : "💵 Cash on Delivery"}
                </p>
                {form.transId && (
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:4 }}>
                    TrxID: {form.transId}
                  </p>
                )}
              </div>

              {/* Items + total */}
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:12, padding:16 }}>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", textTransform:"uppercase",
                  letterSpacing:0.5, marginBottom:10 }}>Items ({cart.length})</p>
                {cart.map(item => (
                  <div key={item.id} style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)",
                  marginTop:10, paddingTop:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Subtotal</span>
                    <span style={{ fontSize:13, color:"#fff" }}>৳{total.toLocaleString()}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>Delivery</span>
                    <span style={{ fontSize:13, color: delivery===0?"#22c55e":"#fff", fontWeight:600 }}>
                      {delivery===0 ? "FREE" : `৳${delivery}`}
                    </span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:16, fontWeight:800, color:"#fff" }}>Grand Total</span>
                    <span style={{ fontSize:22, fontWeight:900, color:"#D4A843" }}>
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setStep("payment")}
                  style={{ flex:1, background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(255,255,255,0.1)", borderRadius:12,
                    padding:"13px", fontWeight:700, fontSize:14, cursor:"pointer",
                    color:"rgba(255,255,255,0.65)" }}>
                  ← Back
                </button>
                <button onClick={placeOrder} disabled={loading}
                  style={{ flex:2, background: loading ? "rgba(212,168,67,0.4)"
                    : "linear-gradient(135deg,#D4A843,#F5C842)",
                    border:"none", borderRadius:12, padding:"13px",
                    fontWeight:800, fontSize:15,
                    cursor: loading ? "not-allowed" : "pointer", color:"#0F0A00",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  {loading ? (
                    <>
                      <div style={{ width:18, height:18,
                        border:"2px solid rgba(0,0,0,0.25)",
                        borderTopColor:"#0F0A00", borderRadius:"50%",
                        animation:"spin 0.7s linear infinite" }}/>
                      Saving to MongoDB...
                    </>
                  ) : "✓ Place Order"}
                </button>
              </div>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div style={{ textAlign:"center", padding:"16px 0 8px" }}>
              <div style={{ fontSize:68, marginBottom:14 }}>🎉</div>
              <h3 style={{ fontSize:26, fontWeight:900, color:"#22c55e", marginBottom:10 }}>
                Order Confirmed!
              </h3>
              <p style={{ color:"rgba(255,255,255,0.55)", fontSize:15, lineHeight:1.7, marginBottom:8 }}>
                Thank you, <strong style={{ color:"#fff" }}>{form.name}</strong>!<br/>
                Your order is saved in our system.
              </p>
              <div style={{ background:"rgba(34,197,94,0.08)",
                border:"1px solid rgba(34,197,94,0.22)",
                borderRadius:16, padding:"18px 24px", margin:"20px 0" }}>
                <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginBottom:6 }}>Order ID</p>
                <p style={{ fontSize:17, fontWeight:800, color:"#22c55e",
                  letterSpacing:0.5, fontFamily:"monospace" }}>
                  {placedOrderId}
                </p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginTop:10 }}>
                  Estimated delivery:{" "}
                  <strong style={{ color:"#fff" }}>1–3 hours</strong>
                </p>
              </div>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", marginBottom:24 }}>
                📱 We&apos;ll contact you on <strong style={{ color:"rgba(255,255,255,0.6)" }}>{form.phone}</strong>
              </p>
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                {session?.user && (
                  <a href="/dashboard"
                    style={{ background:"rgba(212,168,67,0.15)",
                      border:"1px solid rgba(212,168,67,0.35)",
                      borderRadius:12, padding:"12px 24px",
                      fontWeight:700, fontSize:14, color:"#D4A843",
                      textDecoration:"none" }}>
                    Track Order →
                  </a>
                )}
                <button onClick={reset}
                  style={{ background:"linear-gradient(135deg,#D4A843,#F5C842)",
                    border:"none", borderRadius:12, padding:"12px 24px",
                    fontWeight:800, fontSize:14, cursor:"pointer", color:"#0F0A00" }}>
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);} }
        @keyframes spin { to{transform:rotate(360deg);} }
      `}</style>
    </div>
  );
}
