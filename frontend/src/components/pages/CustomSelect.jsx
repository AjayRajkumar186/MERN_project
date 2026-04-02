import { useState, useRef, useEffect } from "react";

const CustomSelect = ({ getAllCategory = [], value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleSelect = (cat) => {
    onChange({ target: { name: "category", value: cat.value } });
    setOpen(false);
  };

  const selectedLabel =
    getAllCategory.find((c) => c.value === value)?.label || "Select Category";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 ${
          open
            ? "bg-indigo-500/10 border border-indigo-500/50 ring-2 ring-indigo-500/10 text-white"
            : "bg-white/5 border border-white/10 text-white/60 hover:border-white/20 hover:text-white/80"
        }`}
      >
        <span className={value ? "text-white" : "text-white/30"}>
          {selectedLabel}
        </span>

        <svg
          className={`w-4 h-4 shrink-0 transition-all duration-300 ${
            open ? "rotate-180 text-indigo-400" : "text-white/25"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute z-50 w-full mt-1.5 rounded-xl bg-[#0d0f16] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden transition-all duration-200 origin-top ${
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* Top accent */}
        <div className="h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent" />

        <ul className="max-h-56 overflow-y-auto py-1 scrollbar-hide">
          {getAllCategory.map((c) => (
            <li
              key={c.value}
              onClick={() => handleSelect(c)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm cursor-pointer transition-all duration-150 ${
                c.value === value
                  ? "bg-indigo-500/15 text-indigo-300"
                  : "text-white/55 hover:bg-white/5 hover:text-white"
              }`}
            >
              {/* Active dot */}
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-200 ${
                  c.value === value ? "bg-indigo-400" : "bg-white/10"
                }`}
              />
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomSelect;