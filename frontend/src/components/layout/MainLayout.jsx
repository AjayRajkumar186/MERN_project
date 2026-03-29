import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";

const MainLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
   
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900
                    text-gray-900 dark:text-white transition-colors">
      {/* Header stays at top */}
      <Header 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <Navbar
       selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* Page content grows to fill space */}
      <main className="flex-1">
        <Outlet context={{ selectedCategory, setSelectedCategory }} />
      </main>

      {/* Footer stays at bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;
