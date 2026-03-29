import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productService } from "../services/product";

const ProductDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryProducts, setCategoryProducts] = useState([]);



  /* 🔹 Fetch all products from API */


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProductById(id);
        setAllProducts(data.products || data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  // Only run this when categoryId is defined
  useEffect(() => {
  if (!allProducts?.category?._id) return;

  const fetchProductsCategory = async () => {
    try {
      const data = await productService.getAllProductsByCategory(
        allProducts.category._id
      );

      // 👇 remove current product
      const filtered = (data.products || data).filter(
        (item) => item._id !== id
      );

      setCategoryProducts(filtered);
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  fetchProductsCategory();
}, [allProducts, id]);


  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product details...
      </div>
    );
  }

  /* 🔹 Find specific product */

  if (!allProducts) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold text-red-500">
          Product not found
        </h2>
        <button
          onClick={() => navigate("/product")}
          className="mt-4 text-indigo-600 underline"
        >
          Back to products
        </button>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-6 py-10 space-y-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:underline"
      >
        ← Back
      </button>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg p-6">
        {/* Image */}
        <div className="flex justify-center">
          <img
            // ✅ Added VITE_IMAGE_URL
            src={`${import.meta.env.VITE_IMAGE_URL}${allProducts.image}`}
            alt={allProducts.title}
            className="w-full max-w-sm object-contain rounded-2xl"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        </div>

        {/* Info */}
        <div>
          {/* ✅ Changed to title */}
          <h1 className="text-3xl font-bold">{allProducts.title}</h1>

          <p className="text-gray-500 mt-2">
            Category:{" "}
            <span className="font-medium">{allProducts.category.name}</span>
          </p>

          <p className="text-indigo-600 text-2xl font-bold mt-4">
            ₹{allProducts.price?.toLocaleString("en-IN")}
          </p>

          <p
            className={`mt-2 font-medium ${allProducts.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
          >
            {allProducts.stock > 0
              ? `In stock (${allProducts.stock})`
              : "Out of stock"}
          </p>

          {/* ✅ Changed to description2 */}
          <p className="mt-4 text-gray-700">{allProducts.description2}</p>

          {/* Specs */}
          {allProducts.specs && Object.keys(allProducts.specs).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Specifications</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {Object.entries(allProducts.specs).map(([key, value]) => (
                  <li key={key}>
                    <span className="capitalize font-medium">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>{" "}
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-500">
            ⭐ {allProducts.rating || 0} / 5 • {allProducts.reviews || 0}{" "}
            reviews
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => addToCart(allProducts)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(allProducts);
                navigate("/cart");
              }}
              className="flex-1 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white py-3 rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {categoryProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="flex gap-6 overflow-x-auto py-2 scrollbar-hide">
            {categoryProducts.map((item) => (
              <Link
                key={item._id || item.id}
                to={`/product/description/${item._id || item.id}`}
                className="flex-none w-52 bg-white rounded-2xl shadow-md hover:shadow-2xs p-4"
              >
                <div className="h-40 flex justify-center items-center">
                  <img
                    // ✅ Added VITE_IMAGE_URL
                    src={`${import.meta.env.VITE_IMAGE_URL}${item.image}`}
                    alt={item.title}
                    className="max-h-full object-contain rounded-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>
                <h3 className="mt-3 font-semibold text-sm truncate">
                  {item.title}
                </h3>
                <p className="mt-1 text-indigo-600 font-bold text-lg">
                  ₹{item.price?.toLocaleString("en-IN")}
                </p>
              </Link>

            ))}

          </div>

        </div>

      )}
    </div>
  );
};

export default ProductDescription;
