import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp, FaInstagram, FaFacebookF, FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaCog, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const socials = [
  { id: "linkedin",  icon: <FaLinkedinIn size={17} />,  color: "#0a66c2", label: "LinkedIn",    pos: { x: 0,    y: -130 }, url: () => "https://linkedin.com" },
  { id: "twitter",   icon: <FaXTwitter size={17} />,    color: "#1d9bf0", label: "Twitter / X", pos: { x: -95,  y: -95  }, url: () => "https://twitter.com" },
  { id: "instagram", icon: <FaInstagram size={17} />,   color: "#dc2743", label: "Instagram",   pos: { x: -130, y: 0    }, url: () => "https://instagram.com" },
  { id: "facebook",  icon: <FaFacebookF size={17} />,   color: "#1877f2", label: "Facebook",    pos: { x: -95,  y: 95   }, url: () => "https://facebook.com" },
  { id: "whatsapp",  icon: <FaWhatsapp size={17} />,    color: "#22c55e", label: "WhatsApp",    pos: { x: 0,    y: 130  },
    url: (s) => `https://wa.me/${s.phoneNumber}?text=${encodeURIComponent(s.defaultMessage)}` },
];

/* ── Particle burst ── */
function Particle({ angle, color }) {
  const dist = 50 + Math.random() * 35;
  const rad = (angle * Math.PI) / 180;
  return (
    <motion.span
      className="absolute rounded-full pointer-events-none"
      style={{ width: 5, height: 5, background: color, top: "50%", left: "50%", x: "-50%", y: "-50%" }}
      initial={{ x: "-50%", y: "-50%", opacity: 0.9, scale: 1 }}
      animate={{ x: `calc(-50% + ${Math.cos(rad) * dist}px)`, y: `calc(-50% + ${Math.sin(rad) * dist}px)`, opacity: 0, scale: 0 }}
      transition={{ duration: 0.5 + Math.random() * 0.15, ease: "easeOut" }}
    />
  );
}

/* ── Ripple ring ── */
function Ripple({ delay = 0 }) {
  return (
    <motion.span
      className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"
      initial={{ scale: 1, opacity: 0.6 }}
      animate={{ scale: 2.6, opacity: 0 }}
      transition={{ duration: 2.4, repeat: Infinity, delay, ease: "easeOut" }}
    />
  );
}

/* ── Magnetic social node ── */
function SocialNode({ item, index, open, whatsappState }) {
  const ref = useRef(null);
  const [mag, setMag] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
    setMag({ x: dx, y: dy });
    setHovered(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.a
          ref={ref}
          href={item.url(whatsappState)}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute flex items-center justify-center w-12 h-12 rounded-full text-white outline outline-transparent"
          style={{ top: "50%", left: "50%", background: item.color }}
          initial={{ x: "-50%", y: "-50%", scale: 0, opacity: 0 }}
          animate={{
            x: `calc(-50% + ${item.pos.x + (hovered ? mag.x : 0)}px)`,
            y: `calc(-50% + ${item.pos.y + (hovered ? mag.y : 0)}px)`,
            scale: hovered ? 1.18 : 1,
            opacity: 1,
            outlineColor: hovered ? item.color + "99" : "transparent",
            boxShadow: hovered ? `0 0 20px ${item.color}99` : "0 4px 14px rgba(0,0,0,0.4)",
          }}
          exit={{ x: "-50%", y: "-50%", scale: 0, opacity: 0 }}
          transition={{
            x: { type: "spring", stiffness: 280, damping: 22 },
            y: { type: "spring", stiffness: 280, damping: 22 },
            scale: { type: "spring", stiffness: 380, damping: 24 },
            opacity: { duration: 0.2, delay: open ? index * 0.065 : 0 },
          }}
          onMouseMove={handleMove}
          onMouseLeave={() => { setHovered(false); setMag({ x: 0, y: 0 }); }}
        >
          {/* Hover pulse ring */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ border: `2px solid ${item.color}` }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.7, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            )}
          </AnimatePresence>

          {/* Tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.span
                className="absolute right-14 text-[11px] font-mono tracking-wider whitespace-nowrap px-2 py-1 rounded"
                style={{ background: "rgba(15,15,15,0.9)", color: "rgba(255,255,255,0.75)" }}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>

          {item.icon}
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ── Main component ── */
export default function SocialDock() {
  const [open, setOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  const whatsappState = useSelector((s) => s.whatsapp);
  const dockRef = useRef(null);

  const toggle = () => {
    if (!open) {
      const burst = Array.from({ length: 16 }, (_, i) => ({
        id: Date.now() + i,
        angle: (360 / 16) * i,
        color: socials[i % socials.length].color,
      }));
      setParticles(burst);
      setTimeout(() => setParticles([]), 700);
    }
    setOpen((p) => !p);
  };

  useEffect(() => {
    const handler = (e) => {
      if (open && dockRef.current && !dockRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={dockRef} className="fixed top-[45%] right-6 z-50">
      <div className="relative w-16 h-16">

        {/* Orbit ring */}
       

        {/* Idle ripple rings */}
        

        {/* Trail lines */}
        {socials.map((item, i) => {
          const angle = Math.atan2(item.pos.x, -item.pos.y) * (180 / Math.PI);
          const len   = Math.sqrt(item.pos.x ** 2 + item.pos.y ** 2) * 0.55;
          return (
            <motion.span
              key={item.id}
              className="absolute top-1/2 left-1/2 w-0.5 pointer-events-none origin-top"
              style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.09), transparent)", transform: `translateX(-50%) rotate(${angle}deg)` }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: open ? len : 0, opacity: open ? 1 : 0 }}
              transition={{ duration: 0.35, delay: open ? i * 0.065 : 0 }}
            />
          );
        })}

        {/* Particle burst */}
        {particles.map((p) => <Particle key={p.id} angle={p.angle} color={p.color} />)}

        {/* Social satellites */}
        {socials.map((item, i) => (
          <SocialNode key={item.id} item={item} index={i} open={open} whatsappState={whatsappState} />
        ))}

        {/* Main button */}
        <motion.button
          onClick={toggle}
          animate={{ rotate: open ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white overflow-hidden"
          style={{
            background: "#111",
            outline: `1.5px solid ${open ? "rgba(255,80,80,0.45)" : "rgba(255,255,255,0.14)"}`,
            transition: "outline-color 0.3s",
          }}
        >
          {/* Ink blob reveal on open */}
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle at 40% 40%, #ff4f4f, #c0392b)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: open ? 1.6 : 0, opacity: open ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          />
          <motion.span
            className="absolute"
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <FaCog size={24} />
          </motion.span>
          <motion.span
            className="absolute"
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <FaTimes size={20} />
          </motion.span>
        </motion.button>

      </div>
    </div>
  );
}