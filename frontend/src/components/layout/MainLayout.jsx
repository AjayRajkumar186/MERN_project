import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";

const MainLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="flex flex-col min-h-screen bg-[#080a0f] text-white transition-colors">
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Navbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <main className="flex-1">
        <Outlet context={{ selectedCategory, setSelectedCategory }} />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;