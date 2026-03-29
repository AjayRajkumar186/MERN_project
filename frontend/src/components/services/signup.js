import api from "./api";

export const signUp = async (data) => {
  try {
    const res = await api.post("/auth/signup", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};