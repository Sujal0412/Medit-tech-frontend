import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { MoveRight } from "lucide-react";
import { useUser } from "../context/userContext";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Animation variants for the mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-white/80 shadow-md z-50 font-poppins"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Section */}
          <Link to="/">
            <Logo className="text-2xl sm:text-3xl" font="text-xl sm:text-2xl" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative text-gray-800 font-medium text-base hover:text-blue-600 transition-all duration-300 group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="relative text-gray-800 font-medium text-base hover:text-blue-600 transition-all duration-300 group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/contact"
              className="relative text-gray-800 font-medium text-base hover:text-blue-600 transition-all duration-300 group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to={
                user
                  ? `${
                      user.role === "receptionist"
                        ? "/reception"
                        : `${user.role}`
                    }`
                  : "/login"
              }
            >
              <button className="bg-gradient-to-r flex items-center gap-2 from-blue-600 to-blue-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                Get Started <MoveRight size={20} />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-blue-600 focus:outline-none transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <FaTimes className="text-2xl sm:text-3xl" />
              ) : (
                <FaBars className="text-2xl sm:text-3xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (visible when toggled) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg"
          >
            <div className="flex flex-col items-center space-y-6 py-6">
              <Link
                to="/"
                onClick={toggleMenu}
                className="text-gray-800 font-medium text-lg hover:text-blue-600 transition-all duration-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                onClick={toggleMenu}
                className="text-gray-800 font-medium text-lg hover:text-blue-600 transition-all duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={toggleMenu}
                className="text-gray-800 font-medium text-lg hover:text-blue-600 transition-all duration-300"
              >
                Contact
              </Link>
              <Link
                to={
                  user
                    ? `${
                        user.role === "receptionist"
                          ? "/reception"
                          : `${user.role}`
                      }`
                    : "/login"
                }
              >
                <button className="bg-gradient-to-r from-blue-600 flex gap-2 items-center to-blue-700 text-white px-6 py-2 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
                  Get Started <MoveRight size={20} />
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Header;
