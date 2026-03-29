import api from "./api";


export const categoryService = {
  getAllCategory: async () => {
    try {
      const res = await api.get("/category");
      return res.data;
    } catch (err) {
      console.error("Error fetching categories:", err);
      throw err.response?.data || { message: "Something went wrong" };
    }
  }
};

