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
  { name: "SmartPhones", icon: <GiSmartphone /> },
  { name: "Laptops", icon: <GiLaptop /> },
  { name: "Headphones", icon: <GiHeadphones /> },
  { name: "SmartWatches", icon: <GiWatch /> },
  { name: "Cameras", icon: <GiPhotoCamera /> },
  { name: "Clothing", icon: <GiShirt /> },
  { name: "Footwear", icon: <GiRunningShoe /> },
  { name: "Televisions", icon: <GiTv /> },
  { name: "WashingMachines", icon: <GiWashingMachine /> },
  { name: "AirConditioners", icon: <GiSnowflake1 /> },
  { name: "Refrigerators", icon: <GiIceCube /> },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCategory = new URLSearchParams(location.search).get("category");

  return (
    <div className="  
      bg-white dark:bg-gray-900 border-b border-indigo-600 shadow mt-14
       md:mt-0
    ">
      <div className="container mx-auto px-4 py-3">
        <div className="flex gap-10 overflow-x-auto whitespace-nowrap scrollbar-hide md:justify-center ">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/product?category=${cat.name}`)}
              className={`text-2xl md:text-3xl flex flex-col items-center transition cursor-pointer
                ${activeCategory === cat.name
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-indigo-600"
                }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
