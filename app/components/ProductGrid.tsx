"use client";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductDetailModal, { type ProductDetailData } from "./ProductDetailModal";

const allProducts: ProductDetailData[] = [
  { id:1,  name:"Fresh Tomatoes",   category:"Vegetables", price:89,  originalPrice:120, unit:"per kg",    img:"https://i.ibb.co.com/ch9RCcrB/Tomato-3-1280.jpg", badge:"Sale",    rating:4.8, reviews:124,
    description:"Farm-fresh tomatoes handpicked at peak ripeness. Juicy, bright red, and full of lycopene. Perfect for salads, curries, and sauces.",
    nutrition:{"Calories":"18 kcal","Protein":"0.9g","Carbs":"3.9g","Fibre":"1.2g","Vitamin C":"14mg","Lycopene":"2.5mg"} },
  { id:2,  name:"Premium Almonds",  category:"Nuts & Dry", price:450, unit:"per 500g",   img:"https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=700&q=85", rating:4.9, reviews:89,
    description:"California-grade premium almonds. Rich in healthy fats, vitamin E, and magnesium. A perfect daily snack for the whole family.",
    nutrition:{"Calories":"579 kcal","Protein":"21g","Carbs":"22g","Fibre":"12g","Fat":"50g","Vitamin E":"25mg"} },
  { id:3,  name:"Mixed Berries",    category:"Fruits",     price:320, unit:"per pack",   img:"https://images.unsplash.com/photo-1425934398893-310a009a77f9?w=700&q=85", badge:"Fresh",   rating:4.7, reviews:203,
    description:"A vibrant mix of strawberries, blueberries, and raspberries — all organic. Bursting with antioxidants and natural sweetness.",
    nutrition:{"Calories":"57 kcal","Protein":"0.7g","Carbs":"14g","Fibre":"2.4g","Vitamin C":"22mg","Antioxidants":"High"} },
  { id:4,  name:"Walnuts",          category:"Nuts & Dry", price:380, unit:"per 500g",   img:"https://images.unsplash.com/photo-1563865436874-9aef32095fad?w=700&q=85", rating:4.6, reviews:67,
    description:"Omega-3 rich walnuts sourced from the best farms. Brain food at its finest — great for snacking or baking.",
    nutrition:{"Calories":"654 kcal","Protein":"15g","Carbs":"14g","Fibre":"6.7g","Fat":"65g","Omega-3":"9g"} },
  { id:5,  name:"Strawberries",     category:"Fruits",     price:210, originalPrice:280, unit:"per pack",  img:"https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=700&q=85", badge:"Hot",     rating:4.9, reviews:341,
    description:"Sun-ripened, fragrant strawberries picked fresh every morning. Sweet, juicy, and naturally red. Great for smoothies and desserts.",
    nutrition:{"Calories":"32 kcal","Protein":"0.7g","Carbs":"7.7g","Fibre":"2g","Vitamin C":"59mg","Folate":"24µg"} },
  { id:6,  name:"Blueberries",      category:"Fruits",     price:290, unit:"per pack",   img:"https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=700&q=85", rating:4.8, reviews:156,
    description:"Plump, sweet blueberries loaded with antioxidants. Nature's superfood — great for yoghurt, smoothies, or straight from the pack.",
    nutrition:{"Calories":"57 kcal","Protein":"0.7g","Carbs":"14g","Fibre":"2.4g","Vitamin K":"19µg","Manganese":"0.3mg"} },
  { id:7,  name:"Orange Juice",     category:"Fresh Juice",price:150, unit:"per bottle", img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=700&q=85", badge:"Fresh",   rating:4.7, reviews:98,
    description:"100% freshly squeezed orange juice — no sugar added, no preservatives. Pure citrus goodness bottled within hours of squeezing.",
    nutrition:{"Calories":"45 kcal","Protein":"0.7g","Carbs":"10g","Vitamin C":"50mg","Potassium":"200mg","Folate":"30µg"} },
  { id:8,  name:"Broccoli",         category:"Vegetables", price:75,  unit:"per piece",  img:"https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=700&q=85", rating:4.5, reviews:44,
    description:"Crisp, dark-green broccoli florets packed with vitamins K and C. Pesticide-free and farm-fresh — perfect for stir-fries and steaming.",
    nutrition:{"Calories":"34 kcal","Protein":"2.8g","Carbs":"7g","Fibre":"2.6g","Vitamin C":"89mg","Vitamin K":"102µg"} },
  { id:9,  name:"Full Cream Milk",  category:"Dairy",      price:95,  unit:"per litre",  img:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=700&q=85", rating:4.6, reviews:189,
    description:"Pure full-cream dairy milk from grass-fed cows. Rich, creamy, and hormone-free. Pasteurised for safety while retaining all natural nutrients.",
    nutrition:{"Calories":"61 kcal","Protein":"3.2g","Carbs":"4.8g","Fat":"3.3g","Calcium":"120mg","Vitamin D":"1.2µg"} },
  { id:10, name:"Organic Spinach",  category:"Organic",    price:60,  unit:"per bunch",  img:"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=700&q=85", badge:"Organic", rating:4.7, reviews:55,
    description:"Tender, dark-green organic spinach leaves. Iron-rich and nutrient-dense. Certified organic — no pesticides, no GMO. Great raw or cooked.",
    nutrition:{"Calories":"23 kcal","Protein":"2.9g","Carbs":"3.6g","Fibre":"2.2g","Iron":"2.7mg","Vitamin A":"469µg"} },
  { id:11, name:"Watermelon",       category:"Fruits",     price:180, unit:"per piece",  img:"https://images.unsplash.com/photo-1563114773-84221bd62daa?w=700&q=85", rating:4.8, reviews:212,
    description:"Sweet, juicy summer watermelons grown in sunlit fields. 92% water content — the perfect hydrating snack on a hot day.",
    nutrition:{"Calories":"30 kcal","Protein":"0.6g","Carbs":"7.5g","Fibre":"0.4g","Vitamin C":"8.1mg","Lycopene":"4.5mg"} },
  { id:12, name:"Green Apple",      category:"Fruits",     price:240, unit:"per kg",     img:"https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=700&q=85", badge:"Fresh",   rating:4.6, reviews:78,
    description:"Crisp, tart Granny Smith green apples. Perfect for snacking, baking, and fresh juices. High fibre and naturally low in calories.",
    nutrition:{"Calories":"52 kcal","Protein":"0.3g","Carbs":"14g","Fibre":"2.4g","Vitamin C":"4.6mg","Potassium":"107mg"} },
];

const badgeColors: Record<string,{bg:string;color:string}> = {
  Sale:    { bg:"rgba(239,68,68,0.85)",  color:"#fff" },
  Hot:     { bg:"rgba(249,115,22,0.85)", color:"#fff" },
  Fresh:   { bg:"rgba(34,197,94,0.85)",  color:"#fff" },
  Organic: { bg:"rgba(212,168,67,0.9)",  color:"#0F0A00" },
};

function ProductCard({ product, onViewDetail }: { product: ProductDetailData; onViewDetail: (p: ProductDetailData) => void }) {
  const { addToCart, cart } = useCart();
  const { toggle, isWished } = useWishlist();
  const { showToast } = useToast();
  const [hover, setHover] = useState(false);

  const inCart = cart.some(c => c.id === product.id);
  const cartQty = cart.find(c => c.id === product.id)?.quantity ?? 0;
  const wished = isWished(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({ id:product.id, name:product.name, price:product.price, img:product.img, unit:product.unit });
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle({ id:product.id, name:product.name, price:product.price, img:product.img, unit:product.unit });
    showToast(wished ? `Removed from wishlist` : `${product.name} saved to wishlist!`, "wish");
  };

  return (
    <div onClick={() => onViewDetail(product)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${inCart ? "rgba(212,168,67,0.5)" : hover ? "rgba(212,168,67,0.25)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        transform: hover ? "translateY(-5px)" : "none",
        boxShadow: hover
          ? "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,67,0.1)"
          : "0 4px 16px rgba(0,0,0,0.2)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>

      {/* Image */}
      <div style={{ position:"relative", height:200, overflow:"hidden", background:"rgba(255,255,255,0.03)" }}>
        <Image src={product.img} alt={product.name} fill
          style={{ objectFit:"cover", transition:"transform 0.5s ease",
            transform: hover ? "scale(1.09)" : "scale(1)" }}
          sizes="(max-width: 768px) 100vw, 33vw"/>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(to top, rgba(15,10,0,0.55) 0%, transparent 50%)" }}/>

        {product.badge && (
          <span style={{
            position:"absolute", top:12, left:12,
            background: badgeColors[product.badge]?.bg ?? "rgba(100,100,100,0.85)",
            color: badgeColors[product.badge]?.color ?? "#fff",
            fontSize:11, fontWeight:800, padding:"4px 12px", borderRadius:20,
            backdropFilter:"blur(8px)",
          }}>{product.badge}</span>
        )}

        {/* Wishlist btn */}
        <button onClick={handleWish}
          style={{
            position:"absolute", top:12, right:12,
            background: wished ? "rgba(236,72,153,0.25)" : "rgba(255,255,255,0.1)",
            backdropFilter:"blur(10px)",
            border:`1px solid ${wished ? "rgba(236,72,153,0.5)" : "rgba(255,255,255,0.2)"}`,
            borderRadius:"50%", width:34, height:34, cursor:"pointer",
            fontSize:17, color: wished ? "#ec4899" : "#fff",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.2s",
          }}
          onMouseEnter={e => { e.stopPropagation(); (e.currentTarget.style.transform = "scale(1.15)"); }}
          onMouseLeave={e => { e.stopPropagation(); (e.currentTarget.style.transform = "scale(1)"); }}>
          {wished ? "♥" : "♡"}
        </button>

        {/* Cart qty badge */}
        {inCart && (
          <div style={{ position:"absolute", bottom:10, left:12,
            background:"rgba(212,168,67,0.9)", backdropFilter:"blur(8px)",
            borderRadius:20, padding:"3px 12px", fontSize:11, fontWeight:700, color:"#0F0A00" }}>
            × {cartQty} in cart
          </div>
        )}

        {/* View detail overlay hint */}
        {hover && (
          <div style={{ position:"absolute", bottom:10, right:12,
            background:"rgba(255,255,255,0.12)", backdropFilter:"blur(8px)",
            borderRadius:20, padding:"3px 12px", fontSize:11,
            fontWeight:600, color:"#fff" }}>
            View Details →
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding:"16px 18px 20px" }}>
        <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginBottom:4,
          fontWeight:600, textTransform:"uppercase", letterSpacing:0.5 }}>
          {product.category}
        </p>
        <h3 style={{ fontSize:16, fontWeight:700, color:"#fff", marginBottom:8, lineHeight:1.3 }}>
          {product.name}
        </h3>

        {/* Stars */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
          <span style={{ color:"#D4A843", fontSize:12 }}>
            {"★".repeat(Math.floor(product.rating))}{"☆".repeat(5-Math.floor(product.rating))}
          </span>
          <span style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>{product.rating}</span>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>({product.reviews})</span>
        </div>

        {/* Price + Add */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <span style={{ fontSize:20, fontWeight:900, color:"#D4A843" }}>৳{product.price}</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)", marginLeft:4 }}>{product.unit}</span>
            {product.originalPrice && (
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.22)", textDecoration:"line-through", marginTop:1 }}>
                ৳{product.originalPrice}
              </div>
            )}
          </div>

          <button onClick={handleAdd}
            style={{
              background: inCart ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #D4A843, #F5C842)",
              border: inCart ? "1px solid rgba(34,197,94,0.45)" : "none",
              borderRadius:24, padding:"9px 18px",
              fontWeight:800, fontSize:13, cursor:"pointer",
              color: inCart ? "#22c55e" : "#0F0A00",
              transition:"all 0.2s",
              boxShadow: inCart ? "none" : "0 4px 12px rgba(212,168,67,0.3)",
            }}
            onMouseEnter={e => { e.stopPropagation(); (e.currentTarget.style.transform = "scale(1.06)"); }}
            onMouseLeave={e => { e.stopPropagation(); (e.currentTarget.style.transform = "scale(1)"); }}>
            {inCart ? `✓ Add More` : "+ Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ activeCategory = "All" }: { activeCategory?: string }) {
  const [sort, setSort] = useState("default");
  const [selectedProduct, setSelectedProduct] = useState<ProductDetailData | null>(null);

  let filtered = activeCategory === "All"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  if (sort === "price-asc")  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === "rating")     filtered = [...filtered].sort((a,b) => b.rating - a.rating);

  return (
    <>
      <section id="products" style={{ padding:"48px 28px 64px", background:"#0F0A00" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          {/* Header */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:16, marginBottom:32 }}>
            <div>
              <p style={{ color:"#D4A843", fontSize:12, fontWeight:700, letterSpacing:1.5,
                textTransform:"uppercase", marginBottom:6 }}>Our Selection</p>
              <h2 style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:"-0.5px" }}>
                {activeCategory === "All" ? "Featured Products" : activeCategory}
                <span style={{ color:"rgba(255,255,255,0.2)", fontSize:17, fontWeight:500, marginLeft:10 }}>
                  ({filtered.length})
                </span>
              </h2>
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:13, color:"rgba(255,255,255,0.35)" }}>Sort:</span>
              <select value={sort} onChange={e => setSort(e.target.value)}
                style={{ background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:13,
                  outline:"none", cursor:"pointer" }}>
                <option value="default"    style={{background:"#1a1200"}}>Default</option>
                <option value="price-asc"  style={{background:"#1a1200"}}>Price: Low → High</option>
                <option value="price-desc" style={{background:"#1a1200"}}>Price: High → Low</option>
                <option value="rating"     style={{background:"#1a1200"}}>Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"rgba(255,255,255,0.3)" }}>
              <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
              <p style={{ fontSize:18, fontWeight:600 }}>No products in this category</p>
            </div>
          ) : (
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(272px, 1fr))", gap:22 }}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onViewDetail={setSelectedProduct}/>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)}/>
    </>
  );
}
