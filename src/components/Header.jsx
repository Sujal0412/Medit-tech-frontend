import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { useUser } from "../context/userContext";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();

  // Track scroll position to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

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

  const getRedirectPath = () => {
    if (!user) return "/login";
    return user.role === "receptionist" ? "/reception" : `/${user.role}`;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full backdrop-blur-xl  z-50 font-poppins transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0C10]/90 shadow-lg border-b border-gray-800/50"
          : "bg-[#0A0C10]/70 border-b border-gray-800/30"
      }`}
    >
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between  items-center h-14 sm:h-16 md:h-18">
          {/* Logo Section */}
          <Link to="/" className="">
            <Logo
              className="text-xl sm:text-2xl md:text-3xl"
              font="text-base sm:text-xl md:text-2xl"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="">
            <Link to={getRedirectPath()}>
              <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center group text-sm sm:text-base">
                Get Started
                <FaArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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
            <div className="flex flex-col items-center space-y-6 py-6">
              <Link
                to={getRedirectPath()}
                onClick={toggleMenu}
                className="w-full flex justify-center"
              >
                <button className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center group text-sm sm:text-base w-3/4 justify-center">
                  Get Started
                  <FaArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
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
