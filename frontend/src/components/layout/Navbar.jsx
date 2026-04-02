import {
  GiSmartphone,
  GiLaptop,
  GiHeadphones,
  GiWatch,
  GiPhotoCamera,
  GiShirt,
  GiRunningShoe,
  GiTv,
  GiWashingMachine,
  GiSnowflake1,
  GiIceCube,
} from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";

const categories = [
  { name: "SmartPhones", icon: GiSmartphone, label: "Phones" },
  { name: "Laptops", icon: GiLaptop, label: "Laptops" },
  { name: "Headphones", icon: GiHeadphones, label: "Audio" },
  { name: "SmartWatches", icon: GiWatch, label: "Watches" },
  { name: "Cameras", icon: GiPhotoCamera, label: "Cameras" },
  { name: "Clothing", icon: GiShirt, label: "Clothing" },
  { name: "Footwear", icon: GiRunningShoe, label: "Footwear" },
  { name: "Televisions", icon: GiTv, label: "TVs" },
  { name: "WashingMachines", icon: GiWashingMachine, label: "Washing" },
  { name: "AirConditioners", icon: GiSnowflake1, label: "AC" },
  { name: "Refrigerators", icon: GiIceCube, label: "Fridge" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCategory = new URLSearchParams(location.search).get("category");

  return (
    <div className="relative bg-[#080a0f]/90 backdrop-blur-xl border-b border-white/6 shadow-lg shadow-black/20  md:mt-0">

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-500/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide py-2 md:pl-10  md:justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/product?category=${cat.name}`)}
                className={`relative flex flex-col items-center gap-1 px-3 sm:px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 shrink-0 group
                  ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400"
                      : "text-white/35 hover:text-white/70 hover:bg-white/5"
                  }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400" />
                )}

                <Icon
                  className={`text-xl sm:text-2xl transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                />

                <span
                  className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                    isActive ? "text-indigo-400" : "text-white/30 group-hover:text-white/55"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;