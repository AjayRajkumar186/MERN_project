import { useState, useEffect } from "react";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaCog,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

/* 180° HORIZONTAL ARC (LEFT → RIGHT ONLY) */
const socials = [
  {
    id: "linkedin",
    icon: <FaLinkedinIn size={20} />,
    color: "#0a66c2",
    url: () => "https://linkedin.com",
    pos: { x: 0, y: -120 }, // ⬆️ straight up
  },
  {
    id: "twitter",
    icon: <FaTwitter size={20} />,
    color: "#38bdf8",
    url: () => "https://twitter.com",
    pos: { x: -80, y: -80 }, // ↖️ top-left
  },
  {
    id: "instagram",
    icon: <FaInstagram size={20} />,
    color: "#e1306c",
    url: () => "https://instagram.com",
    pos: { x: -110, y: 0 }, // ⬅️ left
  },
  {
    id: "facebook",
    icon: <FaFacebookF size={20} />,
    color: "#1877f2",
    url: () => "https://facebook.com",
    pos: { x: -80, y: 80 }, // ↙️ bottom-left
  },
  {
    id: "whatsapp",
    icon: <FaWhatsapp size={20} />,
    color: "#22c55e",
    url: (state) =>
      `https://wa.me/${state.phoneNumber}?text=${encodeURIComponent(
        state.defaultMessage
      )}`,
    pos: { x: 0, y: 120 }, // ⬇️ straight down
  },
];


const WhatsAppButton = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const whatsappState = useSelector((state) => state.whatsapp);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  return (
    <div className="fixed top-[45%] right-6 z-50">

      {/* SOCIAL ICONS – 180° ARC */}
      <AnimatePresence>
        {open &&
          socials.map((item, i) => (
            <motion.a
              key={item.id}
              href={item.url(whatsappState)}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              animate={{
                scale: 1,
                x: item.pos.x,
                y: item.pos.y,
                opacity: 1,
              }}
              exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 24,
                delay: i * 0.06,
              }}
              whileHover={{
                y: item.pos.y - 8,
                backgroundColor: item.color,
                boxShadow: `0 0 25px ${item.color}`,
                scale: 1.18,
              }}
              className="absolute flex items-center justify-center
                         w-12 h-12 rounded-full
                         bg-neutral-900 text-white
                         shadow-xl"
            >
              {item.icon}
            </motion.a>
          ))}
      </AnimatePresence>


      {/* MAIN SETTINGS BUTTON */}
      <motion.button
        onClick={() => setOpen((p) => !p)}
        animate={{
          rotate: open ? 0 : [0, 360], // rotate only when closed
        }}
        transition={{
          repeat: open ? 0 : Infinity, // stop rotation when open
          repeatType: "loop",
          duration: 8, // rotation speed
          ease: "linear",
        }}
        whileHover={{
          scale: 1.1, // hover scale effect
        }}
        className="relative z-10 flex items-center justify-center
             w-12 h-12 rounded-full
             bg-linear-to-br dark:text-white from-gray-300 to-gray-500
             shadow-lg hover:shadow-2xl"
      >
        <FaCog size={26} />
      </motion.button>


    </div>
  );
};

export default WhatsAppButton;
