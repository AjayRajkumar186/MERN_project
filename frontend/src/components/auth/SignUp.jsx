import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signUp, signUpVerify } from "../services/signup";

const SignUp = () => {
  const navigate = useNavigate();
  const [focused, setFocused] = useState(null);
  const [isVerifyMode, setIsVerifyMode] = useState(false); // New state to toggle UI
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP state

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = numericValue.substring(numericValue.length - 1);
    setOtp(newOtp);

    if (newOtp[index] && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // Make sure to import signUpVerify at the top of your file


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (!isVerifyMode) {
      // STEP 1: Initial Signup (Sends the Email)
      const data = await signUp(form);
      
      Swal.fire({
        icon: "success",
        title: "Email Sent! 📧",
        text: data.message || "Please check your inbox for the OTP",
        timer: 2000,
        showConfirmButton: false,
      });
      
      setIsVerifyMode(true); // Toggle the UI to show OTP inputs

    } else {
      // STEP 2: Verify OTP
      const otpCode = otp.join("");
      
      // Basic validation: ensure all 6 digits are filled
      if (otpCode.length < 6) {
        return Swal.fire({
          icon: "warning",
          title: "Incomplete OTP",
          text: "Please enter all 6 digits.",
        });
      }

      // Show a loading spinner while we talk to the server
      Swal.showLoading();

      const result = await signUpVerify({ 
        email: form.email, 
        otp: otpCode 
      });

      Swal.fire({
        icon: "success",
        title: "Verified! 🎉",
        text: result.message || "Your account is now active.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/login");
      });
    }
  } catch (err) {
    // Handles errors from both signUp and signUpVerify
    Swal.fire({
      icon: "error",
      title: "Action Failed",
      text: err.message || "Something went wrong. Please try again.",
    });
  }
};
  const fields = [
    { id: "username", name: "username", type: "text", label: "Username", placeholder: "Choose a username", autoComplete: "username" },
    { id: "email", name: "email", type: "email", label: "Email Address", placeholder: "you@example.com", autoComplete: "new-email" },
    { id: "password", name: "password", type: "password", label: "Password", placeholder: "Create a strong password", autoComplete: "new-password" },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#080a0f] px-4 py-10 overflow-hidden">
      {/* Background Blobs & Grid (Keeping your existing styles) */}
      <div className="absolute -top-20 -right-25 w-72 h-72 bg-violet-600 rounded-full blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-15 -left-20 w-64 h-64 bg-indigo-500 rounded-full blur-[90px] opacity-20 animate-pulse" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="relative bg-white/4 border border-white/10 rounded-2xl px-6 py-10 sm:px-10 sm:py-12 shadow-2xl backdrop-blur-2xl">
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-violet-500 to-transparent rounded-full" />

          {/* Header Changes Based on Mode */}
          <p className="text-[10px] sm:text-[11px] font-semibold tracking-[4px] uppercase text-violet-400 mb-2">
            {isVerifyMode ? "Verification" : "Get Started"}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white leading-none mb-2">
            {isVerifyMode ? "Verify Email" : "Create Account"}
          </h1>
          <p className="text-xs sm:text-sm text-white/40 font-light mb-8">
            {isVerifyMode ? `We sent a code to ${form.email}` : "Join us — it only takes a moment"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isVerifyMode ? (
              // REGULAR SIGNUP FIELDS
              fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className={`block text-[10px] sm:text-[11px] font-medium tracking-[1.5px] uppercase mb-2 transition-colors duration-200 ${focused === field.id ? "text-violet-400" : "text-white/40"}`}>
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      required
                      onChange={handleChange}
                      onFocus={() => setFocused(field.id)}
                      onBlur={() => setFocused(null)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none transition-all duration-300 focus:bg-violet-500/10 focus:border-violet-500/60"
                    />
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-300 ${focused === field.id ? "w-full" : "w-0"}`} />
                  </div>
                </div>
              ))
            ) : (
              // OTP INPUT UI
              <div>
                <label className="block text-[10px] font-medium tracking-[1.5px] uppercase mb-4 text-white/40 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onFocus={() => setFocused(`otp-${i}`)}
                      onBlur={() => setFocused(null)}
                      className={`w-full aspect-square max-w-13 text-center text-lg font-bold rounded-xl bg-white/5 border text-white outline-none transition-all duration-300 caret-transparent
                        ${focused === `otp-${i}`
                          ? "border-violet-500/70 bg-violet-500/10 ring-2 ring-violet-500/15 scale-105"
                          : digit
                          ? "border-violet-500/40 bg-violet-500/5"
                          : "border-white/10"
                        }`}
                    />
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsVerifyMode(false)}
                  className="mt-4 text-[10px] text-violet-400 uppercase tracking-widest hover:text-violet-300 transition-colors"
                >
                  ← Back to details
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-500 hover:from-indigo-500 hover:to-violet-600 text-white text-sm font-medium tracking-wide shadow-lg shadow-violet-500/30 transition-all duration-200"
            >
              {isVerifyMode ? "Verify & Register →" : "Create Account →"}
            </button>
          </form>

          {/* Footer (Same as original) */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-[10px] uppercase tracking-widest text-white/20">OR</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>
          <p className="text-center text-xs sm:text-sm text-white/30">
            Already registered? <Link to="/login" className="text-violet-400 font-medium hover:text-violet-300 underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;