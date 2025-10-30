import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiHome,
  FiGrid,
  FiCode,
  FiLayers,
  FiStar,
  FiDroplet,
  FiInfo,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import SearchBar from "./SearchBar";

const Navbar = ({ darkMode, setDarkMode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/components", label: "Components", icon: FiGrid },
    { path: "/snippets", label: "Snippets", icon: FiCode },
    { path: "/templates", label: "Templates", icon: FiLayers },
    { path: "/effects", label: "Effects", icon: FiStar },
    { path: "/colors", label: "Colors", icon: FiDroplet },
    { path: "/about", label: "About", icon: FiInfo },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white dark:bg-slate-900 shadow-lg sticky top-0 z-50 transition-all duration-300 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex-shrink-0 flex items-center group"
                onClick={closeMobileMenu}
              >
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                  🎨 CodeMint
                </span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6 items-center h-full">
              <div className="w-full py-2">
                <SearchBar className="w-full" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                aria-label="Toggle dark mode"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: darkMode ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? (
                    <FiSun className="w-5 h-5" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )}
                </motion.div>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 md:hidden overflow-y-auto border-l border-gray-200 dark:border-slate-800"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={closeMobileMenu}
                >
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    🎨 CodeMint
                  </span>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-200"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-200 dark:border-slate-800">
                <SearchBar mobile={true} />
              </div>

              {/* Navigation Links */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    const isActive = location.pathname === link.path;

                    return (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          onClick={closeMobileMenu}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            isActive
                              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 shadow-sm"
                              : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${
                              isActive ? "text-purple-600 dark:text-purple-400" : ""
                            }`}
                          />
                          <span>{link.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full ml-auto"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Dark Mode Toggle in Mobile Menu */}
              <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  <span className="flex items-center space-x-3">
                    {darkMode ? (
                      <FiSun className="w-5 h-5" />
                    ) : (
                      <FiMoon className="w-5 h-5" />
                    )}
                    <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                  </span>
                  <div
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-200 ${
                      darkMode
                        ? "bg-purple-600 justify-end"
                        : "bg-gray-300 justify-start"
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200" />
                  </div>
                </button>
              </div>

              {/* Footer Section */}
              <div className="p-6 border-t border-gray-200 dark:border-slate-800 mt-auto">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  <p>Made with ❤️ by the Community</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;