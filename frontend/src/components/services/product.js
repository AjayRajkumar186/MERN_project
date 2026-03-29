import api from "./api";

export const productService = {
  getAllProducts: async () => {
    try {
      const res = await api.get("/products");
      return res.data;
    } catch (err) {
      console.error("Error fetching product:", err);
      throw err.response?.data || { message: "Something went wrong" };
    }
  },
  getAllProductsByCategory: async (categoryId) => {
  try {
    // If categoryId exists, call /products?category=123
    const res = await api.get(`/products?category=${categoryId}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Error" };
  }
},
  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching product:", err);
      throw err.response?.data || { message: "Something went wrong" };
    }
  },
 createProduct: async (formData) => {
    try {
      // ✅ REMOVED the manual headers. Axios will auto-detect FormData and add the boundary!
      const res = await api.post(`/products`, formData);
      return res.data;
    } catch (err) {
      console.error("Error creating product:", err);
      throw err.response?.data || { message: "Something went wrong" };
    }
  },

  updateProduct: async (id, formData) => {
    try {
      // ✅ REMOVED the manual headers here too
      const res = await api.put(`/products/${id}`, formData);
      return res.data;
    } catch (err) {
      console.error("Error updating product:", err);
      throw err.response?.data || { message: "Something went wrong" };
    }
  },

  deleteProductById: async (id) => {
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error delete product:", err);
      throw err.response?.data || { message: "Something went wrong" };
    }
  },
};
