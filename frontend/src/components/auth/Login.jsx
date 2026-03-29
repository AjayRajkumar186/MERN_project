import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {login} from "../services/login";
import Swal from "sweetalert2";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ where user wanted to go before login
  const from = location.state?.from || "/";

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await login({ email, password }); // ✅ FIX

    // ✅ Admin login
    if (result.role === "admin") {
      Swal.fire({
        icon: "success",
        title: "Welcome Admin",
        text: "Login successful",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/", { replace: true });
      });
    }
    // ✅ User login
    else {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(from, { replace: true });
      });
    }

  } catch (err) {
    // ❌ Invalid login (handled from backend error)
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: err.message || "Invalid email or password",
      confirmButtonColor: "#d33",
    });
  }
};

  return (
   <div className="min-h-screen flex items-center justify-center px-4
                bg-linear-to-br from-indigo-100 via-white to-indigo-100
                dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">

  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md p-10 rounded-xl shadow-2xl
               bg-white dark:bg-gray-800
               text-gray-900 dark:text-white
               animate-fadeIn transform transition duration-500"
  >
    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600 tracking-wide">
      Welcome Back
    </h2>

    {error && (
      <p className="text-red-500 text-sm mb-4 text-center animate-pulse">
        {error}
      </p>
    )}

    {/* Email */}
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
        Email
      </label>
      <input
        type="email"
        className="w-full px-4 py-2 rounded-md
                   border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-indigo-500 transition-all duration-300"
        placeholder="Enter your email"
        autoComplete="current-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    {/* Password */}
    <div className="mb-6">
      <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
        Password
      </label>
      <input
        type="password"
        className="w-full px-4 py-2 rounded-md
                   border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-indigo-500 transition-all duration-300"
        placeholder="Enter your password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    {/* Button */}
    <button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700
                 text-white py-2 rounded-lg font-semibold
                 transition-colors duration-300"
    >
      Login
    </button>

    {/* Footer */}
    <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="text-indigo-600 font-semibold hover:underline"
      >
        Sign up
      </Link>
    </p>
  </form>
</div>

  );
};

export default Login;
