import { useState } from "react";

const Navigation = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const navItems = ["Home", "Services", "About Us", "Resources"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">cyde</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent">x</span>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-white/80 hover:text-white transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/threat-intelligence" className="text-white/80 hover:text-white transition-colors relative group">
              Threat Intelligence
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors relative group">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors relative group">
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>
          
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