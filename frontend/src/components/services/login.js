import api from "./api";

export const sendOtp = async ({ email }) => {
  try {
    const res = await api.post("/auth/login", { email });
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await api.post("/auth/login/verify", { email, otp });
    const response = res.data;

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("role", response.user.role);

    return response;
  } catch (err) {
    throw err.response?.data || { message: "Something went wrong" };
  }
};