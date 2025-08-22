import { useState } from "react";

const Navigation = () => {
  const [activeItem, setActiveItem] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
            
            {/* Services Dropdown */}
            <div className="relative group">
              <a href="#" className="text-white/80 hover:text-white transition-colors relative">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
              </a>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background/95 backdrop-blur-md border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <a href="/threat-intelligence" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                    Threat Intelligence
                  </a>
                </div>
              </div>
            </div>

            <a href="/about-us" className="text-white/80 hover:text-white transition-colors relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
            </a>
            
            {/* Resources Dropdown */}
            <div className="relative group">
              <a href="#" className="text-white/80 hover:text-white transition-colors relative">
                Resources
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyber-amber transition-all duration-300 group-hover:w-full"></span>
              </a>
              <div className="absolute top-full left-0 mt-2 w-56 bg-background/95 backdrop-blur-md border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <a href="/catalog" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                    Catalog
                  </a>
                  <a href="/intrusion-set-crosswalk" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                    Intrusion Set Crosswalk
                  </a>
                  <a href="/cyber-map-america" className="block px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                    Cyber Map of America
                  </a>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <a 
                href="/" 
                className="block text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              
              <div className="space-y-2">
                <span className="block text-white/60 text-sm font-medium">Services</span>
                <a 
                  href="/threat-intelligence" 
                  className="block text-white/80 hover:text-white transition-colors pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Threat Intelligence
                </a>
              </div>
              
              <a 
                href="/about-us" 
                className="block text-white/80 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </a>
              
              <div className="space-y-2">
                <span className="block text-white/60 text-sm font-medium">Resources</span>
                <a 
                  href="/catalog" 
                  className="block text-white/80 hover:text-white transition-colors pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Catalog
                </a>
                <a 
                  href="/intrusion-set-crosswalk" 
                  className="block text-white/80 hover:text-white transition-colors pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Intrusion Set Crosswalk
                </a>
                <a 
                  href="/cyber-map-america" 
                  className="block text-white/80 hover:text-white transition-colors pl-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Cyber Map of America
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;