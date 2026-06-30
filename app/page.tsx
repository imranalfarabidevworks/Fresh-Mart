"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import ProductGrid from "./components/ProductGrid";
import FeatureHighlight from "./components/FeatureHighlight";
import PromoBanner from "./components/PromoBanner";
import StatsSection from "./components/StatsSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  return (
    <main>
      <Navbar />
      <Hero />
      <Categories onSelect={setActiveCategory} />
      <ProductGrid activeCategory={activeCategory} />
      <FeatureHighlight />
      <PromoBanner />
      <StatsSection />
      <Newsletter />
      <Footer />
      <FloatingActions />
    </main>
  );
}
