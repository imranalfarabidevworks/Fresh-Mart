import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 🌟 ব্রাউজারে থাকলে কারেন্ট অরিজিন (Vercel-এ থাকলে Vercel, লোকালহোস্টে থাকলে লোকালহোস্ট) নিবে, 
  // আর সার্ভার সাইডে থাকলে এনভায়রনমেন্ট ভেরিয়েবল বা ফলব্যাক URL নিবে।
  baseURL: typeof window !== "undefined" 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_APP_URL || "https://freshmart-bay.vercel.app"),
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;