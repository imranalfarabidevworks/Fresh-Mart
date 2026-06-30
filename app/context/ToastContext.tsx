"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface Toast {
  id: number; message: string; type: "success" | "error" | "info" | "wish";
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const icons = { success: "✓", error: "✕", info: "ℹ", wish: "♥" };
  const colors = {
    success: { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.35)", icon: "#22c55e" },
    error:   { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.35)",  icon: "#ef4444" },
    info:    { bg: "rgba(99,102,241,0.15)",border: "rgba(99,102,241,0.35)", icon: "#818cf8" },
    wish:    { bg: "rgba(236,72,153,0.15)",border: "rgba(236,72,153,0.35)", icon: "#ec4899" },
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map(t => {
          const c = colors[t.type];
          return (
            <div key={t.id} style={{
              background: `rgba(15,10,0,0.92)`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${c.border}`,
              borderLeft: `3px solid ${c.icon}`,
              borderRadius: 14,
              padding: "13px 18px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              minWidth: 240, maxWidth: 320,
              pointerEvents: "all",
            }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%",
                background: c.bg, display: "flex", alignItems: "center",
                justifyContent: "center", color: c.icon, fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                {icons[t.type]}
              </span>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 500, lineHeight: 1.4 }}>
                {t.message}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
