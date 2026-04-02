import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/login";
import Swal from "sweetalert2";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  // ── Step 1: Send OTP ──
  const handleEmailSubmit = async (e) => {
    e?.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await sendOtp({ email });
      setStep(2);
      // auto-focus first OTP box
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send OTP",
        text: err.message || "Something went wrong",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ──
  const handleOtpChange = (index, value) => {
  // 1. Only take the last character entered (prevents double digits)
  // 2. Ensure it's only numbers (if that's your goal)
  const numericValue = value.replace(/[^0-9]/g, "");
  const lastChar = numericValue.substring(numericValue.length - 1);

  const newOtp = [...otp]; // Assuming your state is an array
  newOtp[index] = lastChar;
  setOtp(newOtp);

  // Auto-focus next input if a value was entered
  if (lastChar && index < 5) {
    document.getElementById(`otp-${index + 1}`).focus();
  }
};
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
    if (e.key === "ArrowRight" && index < 5)
      document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const updated = [...otp];
    pasted.split("").forEach((char, i) => {
      updated[i] = char;
    });
    setOtp(updated);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
  };

  // ── Step 2: Verify OTP ──
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;
    setLoading(true);
    try {
      const result = await verifyOtp({ email, otp: otpValue });

      Swal.fire({
        icon: "success",
        title:
          result.user.role === "admin" ? "Welcome Admin" : "Login Successful",
        text:
          result.user.role === "admin" ? "Login successful" : "Welcome back!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate(result.user.role === "admin" ? "/" : from, { replace: true });
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Invalid OTP",
        text: err.message || "Please check your OTP and try again",
        confirmButtonColor: "#d33",
      });
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#080a0f] px-4 py-10 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-20 -left-25 w-72 h-72 sm:w-96 sm:h-96 lg:w-125 lg:h-125 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-15 -right-20 w-64 h-64 sm:w-80 sm:h-80 lg:w-100 lg:h-100 bg-purple-600 rounded-full blur-[90px] opacity-20 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-cyan-500 rounded-full blur-[80px] opacity-10 animate-pulse" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="relative bg-white/4 border border-white/10 rounded-2xl px-6 py-10 sm:px-10 sm:py-12 shadow-2xl backdrop-blur-2xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent rounded-full" />

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step === 1 ? "bg-indigo-500 text-white" : "bg-indigo-500/20 text-indigo-400"}`}
              >
                {step > 1 ? "✓" : "1"}
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${step === 1 ? "text-indigo-400" : "text-white/30"}`}
              >
                Email
              </span>
            </div>
            <div
              className={`flex-1 h-px transition-all duration-500 ${step === 2 ? "bg-indigo-500/50" : "bg-white/10"}`}
            />
            <div className="flex items-center gap-1.5">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${step === 2 ? "bg-indigo-500 text-white" : "bg-white/10 text-white/30"}`}
              >
                2
              </span>
              <span
                className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${step === 2 ? "text-indigo-400" : "text-white/30"}`}
              >
                Verify
              </span>
            </div>
          </div>

          {/* ══ STEP 1 — EMAIL ══ */}
          {step === 1 && (
            <>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[4px] uppercase text-indigo-400 mb-2">
                Secure Portal
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white leading-none mb-2">
                Sign In
              </h1>
              <p className="text-xs sm:text-sm text-white/40 font-light mb-8">
                Enter your email to receive an OTP
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className={`block text-[10px] sm:text-[11px] font-medium tracking-[1.5px] uppercase mb-2 transition-colors duration-200 ${
                      focused === "email" ? "text-indigo-400" : "text-white/40"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 outline-none transition-all duration-300 focus:bg-indigo-500/10 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/10"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      required
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ${focused === "email" ? "w-full" : "w-0"}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Send OTP →"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-[10px] uppercase tracking-widest text-white/20">
                  New here?
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>
              <p className="text-center text-xs sm:text-sm text-white/30">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors duration-200"
                >
                  Create one
                </Link>
              </p>
            </>
          )}

          {/* ══ STEP 2 — OTP ══ */}
          {step === 2 && (
            <>
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[4px] uppercase text-indigo-400 mb-2">
                Verification
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-wide text-white leading-none mb-2">
                Enter OTP
              </h1>
              <p className="text-xs sm:text-sm text-white/40 font-light mb-6">
                6-digit code sent to your email
              </p>

              {/* Locked email pill */}
              <div className="flex items-center gap-2 mb-8 px-4 py-2.5 rounded-xl bg-indigo-500/8 border border-indigo-500/20">
                <svg
                  className="w-4 h-4 text-indigo-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M2 7l10 7 10-7" />
                </svg>
                {/* ✅ Email value shown here — locked, not editable */}
                <span className="text-sm text-white/70 font-mono tracking-wide flex-1 truncate">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp(["", "", "", "", "", ""]);
                  }}
                  className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                >
                  Edit
                </button>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-medium tracking-[1.5px] uppercase mb-4 text-white/40">
                    One-Time Password
                  </label>
                  <div
                    className="flex gap-2 sm:gap-3 justify-between"
                    onPaste={handleOtpPaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric" // Opens numeric keypad on mobile
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onFocus={() => setFocused(`otp-${i}`)}
                        onBlur={() => setFocused(null)}
                        className={`w-full aspect-square max-w-[52px] text-center text-lg font-bold rounded-xl bg-white/5 border text-white outline-none transition-all duration-300 caret-transparent
    ${
      focused === `otp-${i}`
        ? "border-indigo-500/70 bg-indigo-500/10 ring-2 ring-indigo-500/15 scale-105"
        : digit
          ? "border-indigo-500/40 bg-indigo-500/5"
          : "border-white/10"
    }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!otpFilled || loading}
                  className="w-full py-3 sm:py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 text-white text-sm font-medium tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {loading ? "Verifying..." : "Verify & Sign In →"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-white/[0.07]" />
                <span className="text-[10px] uppercase tracking-widest text-white/20">
                  or
                </span>
                <div className="flex-1 h-px bg-white/[0.07]" />
              </div>
              <p className="text-center text-xs text-white/30">
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline transition-colors duration-200 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
