import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CustomSelect from "./CustomSelect";
import { categoryService } from "../services/category";
import { productService } from "../services/product";
import { useNavigate, useLocation, useParams } from "react-router-dom";

/* 🔹 Dynamic specs */
const categorySpecs = {
  SmartPhones: [
    "display",
    "processor",
    "ram",
    "storage",
    "battery",
    "camera",
    "connectivity",
  ],
  Laptops: [
    "display",
    "processor",
    "ram",
    "storage",
    "graphics",
    "battery",
    "connectivity",
  ],
  Headphones: [
    "type",
    "impedance",
    "frequencyResponse",
    "battery",
    "connectivity",
  ],
  SmartWatches: [
    "display",
    "battery",
    "sensors",
    "waterResistance",
    "connectivity",
  ],
  Cameras: ["video", "photo", "battery", "stabilization"],
  Footwear: ["material", "sizes", "color", "weight"],
  Clothing: ["material", "sizes", "color", "style"],
  Televisions: [
    "screenSize",
    "resolution",
    "displayType",
    "smartTV",
    "connectivity",
  ],
  WashingMachines: ["capacity", "type", "spinSpeed", "features"],
  AirConditioners: ["coolingCapacity", "energyRating", "type", "features"],
  Refrigerators: ["capacity", "type", "features", "energyRating"],
};

const emptyForm = {
  id: "",
  title: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  imagePreview: null, // ✅ Added for the UI preview
  description1: "",
  description2: "",
  rating: "",
  reviews: "",
  specs: {},
  user: "",
};

const AddProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: urlProductId } = useParams();
  const prevCategoryRef = useRef(null);

  const [form, setForm] = useState(emptyForm);

  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [productList, setProductList] = useState([]);
  const [User, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const editingProductId = urlProductId || null;

  const editingProduct = productList.find(
    (p) => String(p._id || p.id) === String(editingProductId),
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const categoryData = await categoryService.getAllCategory();
        const options = categoryData.categories.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setCategoriesList(options);

        const productData = await productService.getAllProducts();
        setProductList(productData.products || productData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectChanges = (e) => {
    const value = e.target.value;
    const selected = categoriesList.find((c) => c.value === value);

    setSelectedCategory(selected);
    setSelectedCategoryName(selected?.label);

    setForm((prev) => ({
      ...prev,
      category: value,
      specs: {},
    }));
  };

  /* 🔹 PREFILL (edit mode) */
  useEffect(() => {
    if (!editingProduct || categoriesList.length === 0) return;

    const categoryId =
      typeof editingProduct.category === "object"
        ? editingProduct.category._id
        : editingProduct.category;

    const selected = categoriesList.find((c) => c.value === categoryId);

    if (selected) {
      setSelectedCategory(selected);
      setSelectedCategoryName(selected.label);

      setForm((prev) => ({
        ...prev,
        ...editingProduct,
        category: selected.value,
        specs: editingProduct.specs || {},
      }));
    }
  }, [editingProduct, categoriesList]);

  useEffect(() => {
    if (!selectedCategoryName) return;

    if (prevCategoryRef.current === null) {
      prevCategoryRef.current = selectedCategoryName;
      return;
    }

    if (prevCategoryRef.current !== selectedCategoryName) {
      setForm((prev) => ({ ...prev, specs: {} }));
    }

    prevCategoryRef.current = selectedCategoryName;
  }, [selectedCategoryName]);

  /* 🔹 INPUT HANDLER */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.length) {
      // ✅ Store the raw File object and generate a temporary preview URL
      setForm((prev) => ({
        ...prev,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSpecChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.price || !form.stock) {
      Swal.fire("Missing Fields", "Please fill all required fields", "warning");
      return;
    }

    if (!User || (!User.id && !User._id)) {
      Swal.fire("Error", "User not found. Please log in again.", "error");
      return;
    }

    // ✅ Using FormData for Multer
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description1", form.description1);
    formData.append("description2", form.description2);
    formData.append("category", form.category);
    formData.append("price", Number(form.price));
    formData.append("stock", Number(form.stock));
    formData.append("rating", Number(form.rating || 0));
    formData.append("reviews", Number(form.reviews || 0));
    formData.append("user", User.id || User._id);

    // Stringify the specs object
    formData.append("specs", JSON.stringify(form.specs));

    // ✅ SIMPLIFIED: If form.image exists and has a 'name' property, it's a file!
    if (form.image && form.image.name) {
      formData.append("image", form.image);
    } else if (!editingProduct) {
      // If we are creating a NEW product and there is no image, stop and warn the user
      Swal.fire("Missing Image", "Please upload a product image", "warning");
      return;
    }

    try {
      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        await productService.updateProduct(id, formData);
      } else {
        await productService.createProduct(formData);
      }

      Swal.fire({
        icon: "success",
        title: editingProduct ? "Product Updated" : "Product Added",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => navigate("/product"));
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to save the product",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <p className="text-indigo-100 dark:text-indigo-200 text-sm mt-1">
            Fill product details carefully
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full rounded-xl px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <CustomSelect
                getAllCategory={categoriesList}
                value={selectedCategory?.value}
                onChange={handleSelectChanges}
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Pricing & Stock
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {["price", "stock", "rating", "reviews"].map((field) => (
                <input
                  key={field}
                  type="number"
                  step={field === "rating" ? "0.1" : undefined}
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full rounded-xl px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              ))}
            </div>
          </div>

          {/* Specs */}
          {categorySpecs[selectedCategoryName] && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorySpecs[selectedCategoryName].map((spec) => (
                  <input
                    key={spec}
                    value={form.specs[spec] || ""}
                    placeholder={spec.replace(/([A-Z])/g, " $1")}
                    onChange={(e) => handleSpecChange(spec, e.target.value)}
                    className="w-full rounded-xl px-4 py-3 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          {/* 🔹 Image Upload */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Product Image
            </h3>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-200"
            />

            {(form.imagePreview || form.image) && (
              <div className="mt-4 flex justify-center">
                <img
                  // ✅ SMART SRC: Uses the new local preview OR the existing backend image URL
                  src={
                    form.imagePreview
                      ? form.imagePreview
                      : `${import.meta.env.VITE_IMAGE_URL}${form.image}`
                  }
                  alt="Preview"
                  className="h-48 object-contain rounded-xl border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 p-3"
                  // Optional: Fallback if the image fails to load
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/300?text=No+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Description 1
            </h3>
            <textarea
              name="description1"
              value={form.description1}
              onChange={handleChange}
              placeholder="Product description..."
              rows="2"
              className="w-full rounded-xl px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
              Description 2
            </h3>
            <textarea
              name="description2"
              value={form.description2}
              onChange={handleChange}
              placeholder="Product description..."
              rows="4"
              className="w-full rounded-xl px-4 py-3 border bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg transition"
          >
            {editingProduct ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
