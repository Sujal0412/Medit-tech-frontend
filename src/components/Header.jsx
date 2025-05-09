import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
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
      className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-[#0A0C10]/80 border-b border-gray-800/50 z-50 font-poppins"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo Section */}
          <Link to="/">
            <Logo className="text-2xl sm:text-3xl" font="text-xl sm:text-2xl" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex  items-center space-x-8">
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
              <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center group">
                Get Started
                <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-blue-400 focus:outline-none transition-all duration-300"
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
            className="md:hidden bg-[#0D1117]/95 backdrop-blur-xl border-b border-gray-800"
          >
            <div className="flex flex-col items-center space-y-6 py-8">
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
                onClick={toggleMenu}
              >
                <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center group">
                  Get Started
                  <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
