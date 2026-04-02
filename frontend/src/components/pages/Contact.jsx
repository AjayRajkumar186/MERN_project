import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { notificationService } from "../services/notification";
import Swal from "sweetalert2";
import {
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiSend,
  FiMail,
} from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focused, setFocused] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: "Sending Message...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      background: "#0d0f16",
      color: "#fff",
      didOpen: () => Swal.showLoading(),
    });

    try {
      await notificationService.createNotification({
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
      });
      window.dispatchEvent(new Event("notificationCreated"));

      await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        { name: formData.name, phone: formData.phone, message: formData.message },
        import.meta.env.VITE_EMAIL_PUBLIC_KEY,
      );

      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Your message has been delivered successfully.",
        confirmButtonColor: "#4f46e5",
        background: "#0d0f16",
        color: "#fff",
      });

      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Submission Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
        background: "#0d0f16",
        color: "#fff",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm placeholder-white/20 outline-none transition-all duration-300 ${
      focused === field
        ? "bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/10"
        : "border-white/10 hover:border-white/20"
    }`;

  const fields = [
    { name: "name",    type: "text",  icon: FiUser,          label: "Full Name",   placeholder: "Enter your name",    rows: null },
    { name: "phone",   type: "tel",   icon: FiPhone,         label: "Phone",       placeholder: "Enter phone number", rows: null },
    { name: "message", type: null,    icon: FiMessageSquare, label: "Message",     placeholder: "Write your message...", rows: 4 },
  ];

  return (
    <div className="relative min-h-screen bg-[#080a0f] flex items-center justify-center px-4 py-12 overflow-hidden">

      {/* Blobs */}
      <div className="absolute -top-20 -left-25 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500 rounded-full blur-[100px] opacity-15 animate-pulse pointer-events-none" />
      <div className="absolute -bottom-15 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-violet-600 rounded-full blur-[90px] opacity-15 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-500 rounded-full blur-[80px] opacity-[0.06] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="relative bg-white/[0.035] border border-white/8 rounded-2xl px-6 py-10 sm:px-10 sm:py-12 shadow-2xl backdrop-blur-2xl">

          {/* Top accent line */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-linear-to-r from-transparent via-indigo-500 to-transparent rounded-full" />

          {/* Header */}
          <div
            className={`mb-8 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Icon */}
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-4">
              <FiMail size={18} className="text-indigo-400" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[4px] uppercase text-indigo-400 mb-2">
              Get In Touch
            </p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-none mb-2">
              Contact Us
            </h1>
            <p className="text-xs sm:text-sm text-white/35 font-light">
              Send us a message and we'll get back to you shortly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ name, type, icon: Icon, label, placeholder, rows }, idx) => (
              <div
                key={name}
                className={`transition-all duration-700 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${150 + idx * 80}ms` }}
              >
                <label
                  className={`block text-[10px] sm:text-[11px] font-medium tracking-[1.5px] uppercase mb-2 transition-colors duration-200 ${
                    focused === name ? "text-indigo-400" : "text-white/40"
                  }`}
                >
                  {label}
                </label>
                <div className="relative">
                  <Icon
                    size={13}
                    className={`absolute left-3 transition-colors duration-200 pointer-events-none ${
                      rows ? "top-3.5" : "top-1/2 -translate-y-1/2"
                    } ${focused === name ? "text-indigo-400" : "text-white/25"}`}
                  />
                  {rows ? (
                    <textarea
                      name={name}
                      rows={rows}
                      required
                      value={formData[name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(name)}
                      onBlur={() => setFocused(null)}
                      placeholder={placeholder}
                      className={`${inputClass(name)} pl-9 resize-none`}
                    />
                  ) : (
                    <input
                      type={type}
                      name={name}
                      required
                      value={formData[name]}
                      onChange={handleChange}
                      onFocus={() => setFocused(name)}
                      onBlur={() => setFocused(null)}
                      placeholder={placeholder}
                      className={`${inputClass(name)} pl-9`}
                    />
                  )}
                  {/* Sliding underline */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-350 ${
                      focused === name ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              </div>
            ))}

            {/* Submit */}
            <div
              className={`pt-1 transition-all duration-700 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: "390ms" }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl text-white text-sm font-medium tracking-wide transition-all duration-200 ${
                  isSubmitting
                    ? "bg-indigo-500/40 cursor-not-allowed opacity-60"
                    : "bg-linear-to-r from-indigo-500 to-violet-600 hover:from-violet-600 hover:to-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <FiSend size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;