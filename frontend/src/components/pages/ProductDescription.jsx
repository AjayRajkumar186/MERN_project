import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productService } from "../services/product";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiZap,
  FiStar,
  FiMessageSquare,
  FiPackage,
  FiTag,
} from "react-icons/fi";

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProductById(id);
        setAllProducts(data.products || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setTimeout(() => setMounted(true), 60);
      }
    };
    fetchProducts();
  }, [id]);

  useEffect(() => {
    if (!allProducts?.category?._id) return;
    const fetchProductsCategory = async () => {
      try {
        const data = await productService.getAllProductsByCategory(
          allProducts.category._id
        );
        const filtered = (data.products || data).filter((item) => item._id !== id);
        setCategoryProducts(filtered);
      } catch (error) {
        console.error("Error fetching category products:", error);
      }
    };
    fetchProductsCategory();
  }, [allProducts, id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm text-white/30 tracking-widest uppercase">Loading product</p>
      </div>
    );
  }

  // Not found
  if (!allProducts) {
    return (
      <div className="min-h-screen bg-[#080a0f] flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <FiPackage size={26} className="text-white/20" />
        </div>
        <p className="text-white/50 font-semibold">Product not found</p>
        <button
          onClick={() => navigate("/product")}
          className="text-indigo-400 text-sm hover:underline"
        >
          ← Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#080a0f] overflow-hidden">

      {/* Blobs */}
      <div className="fixed -top-15 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-[0.08] pointer-events-none" />
      <div className="fixed bottom-0 -right-15 w-72 h-72 bg-violet-600 rounded-full blur-[110px] opacity-[0.08] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-sm text-white/40 hover:text-white transition-all duration-200 mb-8 group ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
          } transition-all duration-500`}
        >
          <FiArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
          Back
        </button>

        {/* Main product card */}
        <div
          className={`relative bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-[5%] right-[5%] h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">

            {/* Image panel */}
            <div className="relative flex items-center justify-center bg-[#0d0f16] p-8 sm:p-12 border-b md:border-b-0 md:border-r border-white/6 min-h-75 sm:min-h-100">
              {/* Glow behind image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
              </div>
              <img
                src={`${import.meta.env.VITE_IMAGE_URL}${allProducts.image}`}
                alt={allProducts.title}
                className="relative z-10 w-full max-w-xs sm:max-w-sm object-contain transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400?text=No+Image";
                }}
              />
            </div>

            {/* Info panel */}
            <div className="p-6 sm:p-8 flex flex-col gap-5">

              {/* Category + title */}
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-indigo-400/70 bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-1 rounded-full mb-3">
                  <FiTag size={9} /> {allProducts.category?.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                  {allProducts.title}
                </h1>
              </div>

              {/* Price + stock */}
              <div className="flex items-center gap-4">
                <p className="text-2xl sm:text-3xl font-black text-indigo-400">
                  ₹{allProducts.price?.toLocaleString("en-IN")}
                </p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                  allProducts.stock > 0
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}>
                  {allProducts.stock > 0 ? `In Stock (${allProducts.stock})` : "Out of Stock"}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      size={13}
                      className={
                        star <= Math.round(allProducts.rating || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-white/15"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-white/35">
                  {allProducts.rating || 0} / 5
                </span>
                <span className="flex items-center gap-1 text-xs text-white/25">
                  <FiMessageSquare size={11} /> {allProducts.reviews || 0} reviews
                </span>
              </div>

              {/* Description */}
              {allProducts.description2 && (
                <p className="text-sm text-white/45 leading-relaxed border-t border-white/5 pt-4">
                  {allProducts.description2}
                </p>
              )}

              {/* Specs */}
              {allProducts.specs && Object.keys(allProducts.specs).length > 0 && (
                <div className="border-t border-white/5 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-indigo-400 mb-3">
                    Specifications
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {Object.entries(allProducts.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-1.5 border-b border-white/4">
                        <span className="text-xs text-white/35 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-xs font-medium text-white/65 text-right ml-3">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="flex gap-3 mt-auto pt-2">
                <button
                  onClick={() => addToCart(allProducts)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 hover:text-indigo-300 text-sm font-medium border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200"
                >
                  <FiShoppingCart size={15} /> Add to Cart
                </button>
                <button
                  onClick={() => { addToCart(allProducts); navigate("/cart"); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <FiZap size={15} /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {categoryProducts.length > 0 && (
          <div
            className={`mt-10 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="mb-5">
              <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-1">
                Explore More
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Similar Products
              </h2>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
              {categoryProducts.map((item, idx) => (
                <Link
                  key={item._id || item.id}
                  to={`/product/description/${item._id || item.id}`}
                  className={`group flex-none w-44 sm:w-48 bg-white/3 border border-white/[0.07] rounded-2xl p-4 hover:bg-white/6 hover:border-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${300 + idx * 60}ms` }}
                >
                  <div className="w-full h-32 flex items-center justify-center bg-[#0d0f16] rounded-xl mb-3 overflow-hidden border border-white/5">
                    <img
                      src={`${import.meta.env.VITE_IMAGE_URL}${item.image}`}
                      alt={item.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=No+Image";
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-white/70 group-hover:text-white/90 truncate transition-colors duration-200 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm font-black text-indigo-400">
                    ₹{item.price?.toLocaleString("en-IN")}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;