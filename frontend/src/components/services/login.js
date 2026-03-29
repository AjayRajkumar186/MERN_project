import api from "./api";

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);

    const response = res.data;

    // ✅ Store token
    localStorage.setItem("token", response.token);

    // ✅ Store full user
    localStorage.setItem("user", JSON.stringify(response.user));

    // ✅ Store role separately (easy access)
    localStorage.setItem("role", response.user.role);

    return response;

  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};