import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import CustomSelect from "./CustomSelect";
import { categoryService } from "../services/category";
import { productService } from "../services/product";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FiPackage,
  FiDollarSign,
  FiImage,
  FiFileText,
  FiCpu,
  FiSave,
  FiEdit3,
  FiUploadCloud,
} from "react-icons/fi";

const categorySpecs = {
  SmartPhones: ["display","processor","ram","storage","battery","camera","connectivity"],
  Laptops: ["display","processor","ram","storage","graphics","battery","connectivity"],
  Headphones: ["type","impedance","frequencyResponse","battery","connectivity"],
  SmartWatches: ["display","battery","sensors","waterResistance","connectivity"],
  Cameras: ["video","photo","battery","stabilization"],
  Footwear: ["material","sizes","color","weight"],
  Clothing: ["material","sizes","color","style"],
  Televisions: ["screenSize","resolution","displayType","smartTV","connectivity"],
  WashingMachines: ["capacity","type","spinSpeed","features"],
  AirConditioners: ["coolingCapacity","energyRating","type","features"],
  Refrigerators: ["capacity","type","features","energyRating"],
};

const emptyForm = {
  id: "",
  title: "",
  category: "",
  price: "",
  stock: "",
  image: "",
  imagePreview: null,
  description1: "",
  description2: "",
  rating: "",
  reviews: "",
  specs: {},
  user: "",
};

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none transition-all duration-300 focus:bg-indigo-500/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10";

const SectionCard = ({ icon: Icon, title, delay = "0ms", children }) => (
  <div
    className="relative bg-white/3 border border-white/[0.07] rounded-2xl p-6 transition-all duration-500"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center gap-2.5 mb-5">
      <span className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
        <Icon size={14} />
      </span>
      <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const { id: urlProductId } = useParams();
  const prevCategoryRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [productList, setProductList] = useState([]);
  const [User, setUser] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const editingProductId = urlProductId || null;
  const editingProduct = productList.find(
    (p) => String(p._id || p.id) === String(editingProductId)
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
    setForm((prev) => ({ ...prev, category: value, specs: {} }));
  };

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.length) {
      setForm((prev) => ({
        ...prev,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSpecChange = (key, value) => {
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price || !form.stock) {
      Swal.fire({ icon: "warning", title: "Missing Fields", text: "Please fill all required fields", background: "#0d0f16", color: "#fff" });
      return;
    }
    if (!User || (!User.id && !User._id)) {
      Swal.fire({ icon: "error", title: "Error", text: "User not found. Please log in again.", background: "#0d0f16", color: "#fff" });
      return;
    }

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
    formData.append("specs", JSON.stringify(form.specs));

    if (form.image && form.image.name) {
      formData.append("image", form.image);
    } else if (!editingProduct) {
      Swal.fire({ icon: "warning", title: "Missing Image", text: "Please upload a product image", background: "#0d0f16", color: "#fff" });
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
        background: "#0d0f16",
        color: "#fff",
      }).then(() => navigate("/product"));
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({ icon: "error", title: "Oops...", text: error.message || "Failed to save the product", background: "#0d0f16", color: "#fff" });
    }
  };

  return (
    <div className="min-h-screen bg-[#080a0f] px-4 py-10 sm:py-14">

      {/* Blobs */}
      <div className="fixed -top-20 -left-25 w-72 h-72 lg:w-96 lg:h-96 bg-indigo-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
      <div className="fixed -bottom-15 -right-20 w-64 h-64 lg:w-80 lg:h-80 bg-violet-600 rounded-full blur-[90px] opacity-10 pointer-events-none" />

      <div
        className={`mx-auto max-w-4xl transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[11px] font-medium tracking-[4px] uppercase text-indigo-400 mb-1">
            {editingProduct ? "Editing" : "New Entry"}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h1>
          <p className="text-sm text-white/35 mt-1">Fill in the product details carefully</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Basic Info */}
          <SectionCard icon={FiPackage} title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className={inputClass}
              />
              <CustomSelect
                getAllCategory={categoriesList}
                value={selectedCategory?.value}
                onChange={handleSelectChanges}
                className={inputClass}
              />
            </div>
          </SectionCard>

          {/* Pricing & Stock */}
          <SectionCard icon={FiDollarSign} title="Pricing & Stock">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["price", "stock", "rating", "reviews"].map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-medium tracking-widest uppercase text-white/30 mb-2">
                    {field}
                  </label>
                  <input
                    type="number"
                    step={field === "rating" ? "0.1" : undefined}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Specs */}
          {categorySpecs[selectedCategoryName] && (
            <SectionCard icon={FiCpu} title="Specifications">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categorySpecs[selectedCategoryName].map((spec) => (
                  <div key={spec}>
                    <label className="block text-[10px] font-medium tracking-widest uppercase text-white/30 mb-2">
                      {spec.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      value={form.specs[spec] || ""}
                      placeholder={`Enter ${spec.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                      onChange={(e) => handleSpecChange(spec, e.target.value)}
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Image Upload */}
          <SectionCard icon={FiImage} title="Product Image">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer
                ${dragOver
                  ? "border-indigo-500/70 bg-indigo-500/10"
                  : "border-white/10 hover:border-indigo-500/40 hover:bg-white/2"
                }`}
              onClick={() => document.getElementById("imageInput").click()}
            >
              <input
                id="imageInput"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />

              {form.imagePreview || (form.image && typeof form.image === "string") ? (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={
                      form.imagePreview
                        ? form.imagePreview
                        : `${import.meta.env.VITE_IMAGE_URL}${form.image}`
                    }
                    alt="Preview"
                    className="h-40 object-contain rounded-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300?text=No+Image";
                    }}
                  />
                  <p className="text-xs text-white/30">Click or drag to replace</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <FiUploadCloud size={22} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/50">
                      Drag & drop or <span className="text-indigo-400">browse</span>
                    </p>
                    <p className="text-xs text-white/25 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Descriptions */}
          <SectionCard icon={FiFileText} title="Descriptions">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase text-white/30 mb-2">
                  Description 1
                </label>
                <textarea
                  name="description1"
                  value={form.description1}
                  onChange={handleChange}
                  placeholder="Short product description..."
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium tracking-widest uppercase text-white/30 mb-2">
                  Description 2
                </label>
                <textarea
                  name="description2"
                  value={form.description2}
                  onChange={handleChange}
                  placeholder="Detailed product description..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </SectionCard>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white font-semibold text-sm tracking-wide shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            {editingProduct ? <FiEdit3 size={16} /> : <FiSave size={16} />}
            {editingProduct ? "Update Product" : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;