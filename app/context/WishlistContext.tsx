"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface WishlistItem {
  id: number; name: string; price: number; img: string; unit: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  isWished: (id: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const toggle = (item: WishlistItem) => {
    setWishlist(prev =>
      prev.find(w => w.id === item.id)
        ? prev.filter(w => w.id !== item.id)
        : [...prev, item]
    );
  };

  const isWished = (id: number) => wishlist.some(w => w.id === id);
  const count = wishlist.length;

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWished, count }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
