import { useCart } from "../context/CartContext";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { FiArrowUp, FiShoppingCart, FiZap, FiEdit2, FiTrash2 } from "react-icons/fi";
import { productService } from "../services/product";
import Swal from "sweetalert2";

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useOutletContext();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data.products || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory("All");
  }, []);

  const categoryFromUrl = searchParams.get("category") || "All";
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const filteredProducts = products.filter((product) => {
    const categoryName =
      typeof product.category === "object"
        ? product.category?.name
        : product.category;

    const matchesCategory =
      selectedCategory === "All" || categoryName === selectedCategory;

    const matchesSearch =
      (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (categoryName || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, delete it!",
        background: "#0d0f16",
        color: "#fff",
      });

      if (confirm.isConfirmed) {
        await productService.deleteProductById(productId);
        setProducts((prev) =>
          prev.filter((p) => (p._id || p.id) !== productId)
        );
        Swal.fire({
          title: "Deleted!",
          text: "The product has been deleted.",
          icon: "success",
          background: "#0d0f16",
          color: "#fff",
        });
      }
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Failed to delete product.", "error");
    }
  };

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen bg-[#080a0f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10">

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <FiShoppingCart size={28} className="text-white/20" />
            </div>
            <p className="text-white/30 text-sm font-medium">No products found</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product) => {
            const productId = product._id || product.id;

            return (
              <div
                key={productId}
                className="group relative bg-white/3 border border-white/[0.07] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/5.5 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5"
              >
                {/* Image area */}
                <Link to={`/product/description/${productId}`} className="block">
                  <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-[#0d0f16]">

                    {/* Subtle inner glow on hover */}
                    <div className="absolute inset-0 bg-linear-to-b from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-500 z-10 pointer-events-none" />

                    <img
                      src={`${import.meta.env.VITE_IMAGE_URL}${product.image}`}
                      alt={product.title}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      style={{ mixBlendMode: "normal" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300?text=No+Image";
                      }}
                    />

                    {/* Description overlay slides up */}
                    <div className="absolute inset-x-0 bottom-0 z-20 bg-[#0d0f16]/95 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-400 px-4 py-3">
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
                        {product.description1 || "No description available."}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Product info */}
                <div className="p-4 ">
                  {/* Category pill */}
                 {/*  {product.category && (
                    <span className="inline-block text-[10px] font-medium tracking-widest uppercase text-indigo-400/70 bg-indigo-500/10 px-2 py-0.5 rounded-full mb-2">
                      {typeof product.category === "object"
                        ? product.category?.name
                        : product.category}
                    </span>
                  )} */}

                  <h3 className="text-sm sm:text-base font-semibold text-white/85 leading-snug line-clamp-2 mb-1">
                    {product.title}
                  </h3>

                  <p className="text-indigo-400 font-bold text-base sm:text-lg mt-3">
                    ₹{product.price?.toLocaleString("en-IN")}
                  </p>

                  {/* Buttons */}
                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-400 hover:text-indigo-300 text-xs font-medium border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-200"
                      >
                        <FiShoppingCart size={13} /> Add to Cart
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200"
                      >
                        <FiZap size={13} /> Buy Now
                      </button>
                    </div>

                    {/* Admin buttons */}
                    {user?.role === "admin" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(productId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 text-xs font-medium border border-amber-500/20 hover:border-amber-500/35 transition-all duration-200"
                        >
                          <FiEdit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(productId)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium border border-red-500/20 hover:border-red-500/35 transition-all duration-200"
                        >
                          <FiTrash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll to top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <FiArrowUp size={18} />
        </button>
      )}
    </div>
  );
};

export default Products;