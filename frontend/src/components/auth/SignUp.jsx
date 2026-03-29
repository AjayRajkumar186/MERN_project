import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signUp } from "../services/signup"; // ✅ service import

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await signUp(form); // ✅ API call

      Swal.fire({
        icon: "success",
        title: "Account Created 🎉",
        text: data.message,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/login");
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "User already exists",
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
               text-gray-900 dark:text-white"
  >
    <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
      Create Account
    </h2>

    {/* Name */}
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
        Name
      </label>
      <input
        name="username"
        type="text"
        required
        placeholder="Enter Your UserName"
        autoComplete="username"
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-md
                   border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Email */}
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
        Email
      </label>
      <input
        name="email"
        type="email"
        placeholder="Enter your Email"
        autoComplete="new-email"
        required
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-md
                   border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Password */}
    <div className="mb-6">
      <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
        Password
      </label>
      <input
        name="password"
        type="password"
        placeholder="Create a password"
        autoComplete="new-password"
        required
        onChange={handleChange}
        className="w-full px-4 py-2 rounded-md
                   border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700
                   text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Button */}
    <button
      type="submit"
      className="w-full bg-indigo-600 hover:bg-indigo-700
                 text-white py-2 rounded-lg font-semibold transition-colors"
    >
      Sign Up
    </button>

    {/* Sign in link */}
    <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
      Already have an account?{" "}
      <Link
        to="/login"
        className="text-indigo-600 font-semibold hover:underline"
      >
        Sign in
      </Link>
    </p>
  </form>
</div>

  );
};

export default SignUp;