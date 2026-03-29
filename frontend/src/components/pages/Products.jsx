import { useCart } from "../context/CartContext";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { productService } from "../services/product";
import Swal from "sweetalert2";

const Products = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { selectedCategory, setSelectedCategory } = useOutletContext();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Local state to replace contexts
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // 🔹 1. Fetch User & Products on Mount
  useEffect(() => {
    // Get User from LocalStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch Products from API
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

  // 🔹 2. Filter Logic (Updated to use title and nested category)
  const filteredProducts = products.filter((product) => {
    // Safely extract category name if it's an object from backend populate
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

  // 🔹 3. Delete Logic
  const handleDelete = async (productId) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        await productService.deleteProductById(productId);
        // Remove from local state to update UI instantly
        setProducts((prev) =>
          prev.filter((p) => (p._id || p.id) !== productId),
        );
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire("Error", "Failed to delete product.", "error");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {filteredProducts.map((product) => {
        // Fallback to id if _id doesn't exist
        const productId = product._id || product.id;

        return (
          <div
            key={productId}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl cursor-pointer"
          >
            <Link
              to={`/product/description/${productId}`}
              className="block cursor-pointer"
            >
              {/* Image with hover effect */}
              <div className="relative w-full h-60 overflow-hidden group rounded-xl shadow-lg">
                <img
                  // ✅ Prepend the Vite environment variable to the image filename
                  src={`${import.meta.env.VITE_IMAGE_URL}${product.image}`}
                  alt={product.title}
                  className="w-full h-60 object-contain bg-white transition-all duration-500 group-hover:scale-95"
                  // Optional: Add an onError fallback just in case the image fails to load
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300?text=No+Image";
                  }}
                />
                {/* Sliding overlay from bottom */}
                <div className="absolute left-0 bottom-0 w-full dark:bg-gray-900 dark:text-white bg-gray-50 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-500 p-4 flex items-center justify-center text-center">
                  <p className="text-gray-800 dark:text-white text-sm">
                    {/* ✅ Mapped to description1 directly */}
                    {product.description1 || "No description available."}
                  </p>
                </div>
              </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{product.title}</h3>
              <p className="text-indigo-600 font-bold text-lg mt-1">
                ₹{product.price?.toLocaleString("en-IN")}
              </p>

              {/* Action Buttons */}
              {user?.role === "admin" && (
                <div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleBuyNow(product)}
                      className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Admin Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(productId)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1 rounded-lg font-medium transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(productId)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 rounded-lg font-medium transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Scroll to Top */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300"
        >
          <FiArrowUp size={22} />
        </button>
      )}
    </div>
  );
};

export default Products;
