import { useState } from "react";

const CustomSelect = ({ getAllCategory = [], value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (cat) => {
    onChange({ target: { name: "category", value: cat.value } });
    setOpen(false); // ✅ CLOSE DROPDOWN
  };

  const selectedLabel =
    getAllCategory.find((c) => c.value === value)?.label || "Select Category";

  return (
    <div className="relative w-full">
      {/* Selected Box */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer dark:bg-gray-900 dark:text-white border border-gray-300 rounded-lg p-3 flex justify-between items-center bg-white shadow-sm hover:ring-2 hover:ring-indigo-400 transition-all"
      >
        <span>{selectedLabel}</span>

        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Options */}
      {open && (
        <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto dark:bg-gray-900 dark:text-white bg-white border border-gray-300 rounded-lg shadow-lg">
          {getAllCategory.map((c) => (
            <li
              key={c.value}
              onClick={() => handleSelect(c)}
              className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white transition-all"
            >
              {c.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;