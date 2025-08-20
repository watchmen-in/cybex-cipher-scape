import { useState } from "react";

const Navigation = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const navItems = ["Home", "Services", "About Us", "Resources"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-white text-shadow">
            CyDex
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveItem(item)}
                className={`relative text-white/90 hover:text-white transition-colors duration-300 ${
                  activeItem === item ? "text-white" : ""
                }`}
              >
                {item}
                {activeItem === item && (
                  <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-cyber-amber rounded-full" />
                )}
              </button>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;