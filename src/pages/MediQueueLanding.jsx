import React from "react";
import {
  FaChartLine,
  FaCalendarAlt,
  FaUserCircle,
  FaCogs,
  FaBed,
  FaArrowRight,
  FaStethoscope,
  FaHospital,
  FaHeartbeat,
  FaRegLightbulb,
  FaShieldAlt,
  FaUsers,
  FaArrowDown,
  FaAngleRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

function MediTechLanding() {
  const { user } = useUser();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideIn = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const testimonials = [
    {
      name: "Prajesh Majithiya",
      role: "Frontend Developer",
      quote:
        "Building the user interface for the monitoring system was both challenging and rewarding. Seeing clinicians interact with a tool we crafted is incredibly fulfilling.",
    },
    {
      name: "Sujal Lukhi",
      role: "Backend Engineer",
      quote:
        "Designing a scalable backend to handle real-time alerts and patient data was a critical task. It’s gratifying to know our work directly supports life-saving decisions.",
    },
    {
      name: "Deep Marodiya",
      role: "Frontend Developer",
      quote:
        "Crafting intuitive, accessible UI for healthcare professionals was a top priority. Knowing our design helps doctors respond faster makes every pixel worth it.",
    },
  ];

  const stats = [
    { value: "98%", label: "Patient Satisfaction" },
    { value: "24/7", label: "Support" },
    { value: "500+", label: "Healthcare Partners" },
    { value: "30%", label: "Efficiency Improvement" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-blue-500/5 to-transparent"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-l from-indigo-600/10 to-purple-400/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4"
            >
              Healthcare Innovation
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight"
            >
              Modern Healthcare
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Queue Management
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Streamline patient flow, reduce wait times, and improve healthcare
              efficiency with our intelligent queue management system.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6"
            >
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
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/20 w-full sm:w-auto flex items-center justify-center group">
                  Get Started
                  <FaArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="bg-white/5 hover:bg-white/10 text-white border border-gray-700 px-8 py-4 rounded-lg font-medium transition-all duration-300 w-auto flex items-center justify-center">
                Watch Demo
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex justify-center items-center mb-12"
          >
            <div className="relative w-full max-w-4xl">
              {/* Dashboard mockup frame */}
              <div className="rounded-xl bg-gradient-to-r p-[1px] from-blue-500 to-cyan-400">
                <div className="rounded-xl bg-gray-900 p-2 sm:p-3 backdrop-blur-3xl">
                  {/* Frame header */}
                  <div className="flex items-center mb-2 sm:mb-3 px-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="mx-auto text-[10px] sm:text-xs text-gray-400">
                      MediQueue Dashboard
                    </div>
                  </div>
                  {/* Dashboard content */}
                  <div className="bg-[#0D1117] rounded-lg p-3 sm:p-4 md:p-6 lg:p-8 h-[280px] xs:h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden">
                    <div className="h-full flex flex-col">
                      {/* Dashboard Header */}
                      <div className="flex justify-between items-center mb-3 sm:mb-6">
                        <div>
                          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-100">
                            Queue Analytics
                          </h3>
                          <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-400">
                            Today's Overview • Updated 5m ago
                          </p>
                        </div>
                        <div className="flex gap-1 sm:gap-2">
                          <div className="hidden xs:flex px-2 sm:px-3 py-0.5 sm:py-1 bg-[#171B24] rounded text-[9px] sm:text-xs text-gray-300 border border-gray-800">
                            Live
                          </div>
                          <div className="px-1.5 sm:px-3 py-0.5 sm:py-1 bg-blue-900/30 rounded text-[9px] sm:text-xs text-blue-300 border border-blue-800/30">
                            <FaChartLine
                              className="inline-block mr-0.5 sm:mr-1"
                              size={8}
                            />
                            <span className="hidden xs:inline">Reports</span>
                          </div>
                        </div>
                      </div>

                      {/* Stats Row - Responsive grid for mobile */}
                      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-1.5 xs:gap-2 sm:gap-3 mb-3 sm:mb-6">
                        <div className="bg-[#171B24] p-1.5 xs:p-2 sm:p-3 rounded-lg border border-gray-800">
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                            Total Patients
                          </div>
                          <div className="text-sm xs:text-base sm:text-xl font-bold text-white">
                            142
                          </div>
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-green-400 mt-0.5 sm:mt-1">
                            +12% ↑
                          </div>
                        </div>
                        <div className="bg-[#171B24] p-1.5 xs:p-2 sm:p-3 rounded-lg border border-gray-800">
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                            Waiting
                          </div>
                          <div className="text-sm xs:text-base sm:text-xl font-bold text-yellow-400">
                            27
                          </div>
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-yellow-400 mt-0.5 sm:mt-1">
                            ~8m ⏱️
                          </div>
                        </div>
                        <div className="bg-[#171B24] p-1.5 xs:p-2 sm:p-3 rounded-lg border border-gray-800">
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                            In Progress
                          </div>
                          <div className="text-sm xs:text-base sm:text-xl font-bold text-blue-400">
                            8
                          </div>
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-blue-400 mt-0.5 sm:mt-1">
                            4 docs 👨‍⚕️
                          </div>
                        </div>
                        <div className="bg-[#171B24] p-1.5 xs:p-2 sm:p-3 rounded-lg border border-gray-800">
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">
                            Completed
                          </div>
                          <div className="text-sm xs:text-base sm:text-xl font-bold text-green-400">
                            107
                          </div>
                          <div className="text-[8px] xs:text-[9px] sm:text-xs text-green-400 mt-0.5 sm:mt-1">
                            +15% ↑
                          </div>
                        </div>
                      </div>

                      {/* Chart and Data Area - Stack on mobile, grid on larger screens */}
                      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 gap-1.5 xs:gap-2 sm:gap-4 flex-grow">
                        {/* Left chart: Wait time - Full width on mobile */}
                        <div className="xs:col-span-1 sm:col-span-2 bg-[#171B24] rounded-lg border border-gray-800 p-1.5 xs:p-2 sm:p-3 flex flex-col">
                          <div className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-300 mb-1 sm:mb-2 flex justify-between">
                            <span>Wait Time Trend</span>
                            <span className="text-blue-400">15m avg</span>
                          </div>
                          <div className="flex-grow relative">
                            {/* Axis labels - Smaller on mobile */}
                            <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-[6px] xs:text-[7px] sm:text-[9px] text-gray-500">
                              <span>30m</span>
                              <span>15m</span>
                              <span>0m</span>
                            </div>

                            {/* Chart visualization */}
                            <div className="absolute left-3 xs:left-4 sm:left-5 top-0 right-0 bottom-0 flex items-end">
                              <div className="relative w-full h-full mt-1 sm:mt-2">
                                {/* Chart grid lines */}
                                <div className="absolute top-0 w-full border-t border-dashed border-gray-800"></div>
                                <div className="absolute top-1/2 w-full border-t border-dashed border-gray-800"></div>
                                <div className="absolute bottom-0 w-full border-t border-dashed border-gray-800"></div>

                                {/* Chart line */}
                                <svg
                                  className="absolute inset-0"
                                  viewBox="0 0 100 30"
                                >
                                  <defs>
                                    <linearGradient
                                      id="blueGradient"
                                      x1="0%"
                                      y1="0%"
                                      x2="0%"
                                      y2="100%"
                                    >
                                      <stop
                                        offset="0%"
                                        stopColor="rgba(59, 130, 246, 0.5)"
                                      />
                                      <stop
                                        offset="100%"
                                        stopColor="rgba(59, 130, 246, 0)"
                                      />
                                    </linearGradient>
                                  </defs>
                                  <path
                                    d="M0,25 C10,20 20,15 30,22 C40,29 50,10 60,15 C70,20 80,5 90,8 L100,15"
                                    fill="none"
                                    stroke="#3B82F6"
                                    strokeWidth="1"
                                  />
                                  <path
                                    d="M0,25 C10,20 20,15 30,22 C40,29 50,10 60,15 C70,20 80,5 90,8 L100,15 V30 H0 Z"
                                    fill="url(#blueGradient)"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          {/* Time labels - Reduced on mobile */}
                          <div className="flex justify-between mt-0.5 sm:mt-1 text-[6px] xs:text-[7px] sm:text-[9px] text-gray-500">
                            <span>8AM</span>
                            <span className="hidden xs:block">10AM</span>
                            <span>12PM</span>
                            <span className="hidden xs:block">2PM</span>
                            <span>Now</span>
                          </div>
                        </div>

                        {/* Department Queues - Hidden on very small screens, shown on larger screens */}
                        <div className="hidden xs:flex bg-[#171B24] rounded-lg border border-gray-800 p-1.5 xs:p-2 sm:p-3 flex-col">
                          <div className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-300 mb-1 sm:mb-3">
                            Department Queues
                          </div>
                          <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 flex-grow">
                            <div className="flex justify-between items-center">
                              <div className="text-[8px] xs:text-[9px] sm:text-xs">
                                Cardiology
                              </div>
                              <div className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-blue-400">
                                12
                              </div>
                            </div>
                            <div className="h-1 sm:h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                                style={{ width: "80%" }}
                              ></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-[8px] xs:text-[9px] sm:text-xs">
                                Neurology
                              </div>
                              <div className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-blue-400">
                                8
                              </div>
                            </div>
                            <div className="h-1 sm:h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                                style={{ width: "55%" }}
                              ></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-[8px] xs:text-[9px] sm:text-xs">
                                Orthopedics
                              </div>
                              <div className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-blue-400">
                                5
                              </div>
                            </div>
                            <div className="h-1 sm:h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                                style={{ width: "35%" }}
                              ></div>
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="text-[8px] xs:text-[9px] sm:text-xs">
                                Pediatrics
                              </div>
                              <div className="text-[8px] xs:text-[9px] sm:text-xs font-medium text-blue-400">
                                2
                              </div>
                            </div>
                            <div className="h-1 sm:h-1.5 bg-[#0D1117] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                                style={{ width: "15%" }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile-only simplified department overview */}
                        <div className="xs:hidden bg-[#171B24] rounded-lg border border-gray-800 p-2 flex-col">
                          <div className="text-[9px] font-medium text-gray-300 mb-1">
                            Top Departments
                          </div>
                          <div className="space-y-1 flex-grow">
                            <div className="flex items-center justify-between">
                              <div className="text-[8px]">Cardiology</div>
                              <div className="text-[8px] font-medium text-blue-400">
                                12
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-[8px]">Neurology</div>
                              <div className="text-[8px] font-medium text-blue-400">
                                8
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="text-[8px]">Others</div>
                              <div className="text-[8px] font-medium text-blue-400">
                                7
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Visual decorations */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-cyan-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </motion.div>

          <motion.a
            href="#features"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col items-center justify-center mt-12 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <span className="text-sm mb-2">Discover Features</span>
            <FaArrowDown className="animate-bounce" />
          </motion.a>
        </div>

        {/* Stats section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="relative">
            <div className="absolute inset-0 h-1/2 bg-gradient-to-b from-[#0A0C10] to-transparent"></div>
            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-[#0D1117] border border-gray-800 rounded-xl p-6 backdrop-blur-xl"
                  >
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-blue-600/10 to-cyan-400/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4">
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Everything You Need for Modern Healthcare
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to
              streamline operations and deliver exceptional patient care.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Feature Cards */}
            <motion.div
              variants={fadeIn}
              className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/50 p-8 rounded-xl transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center text-blue-400 mb-6 group-hover:from-blue-600/30 group-hover:to-blue-400/30 transition-colors duration-300">
                <FaBed className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Smart Patient Queue
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Intelligent queue management system that prioritizes patients
                based on urgency and optimizes waiting times.
              </p>
              <div className="mt-6 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                Learn more{" "}
                <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-[#0D1117] border border-gray-800 hover:border-cyan-500/50 p-8 rounded-xl transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-600/20 to-cyan-400/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:from-cyan-600/30 group-hover:to-cyan-400/30 transition-colors duration-300">
                <FaHeartbeat className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Real-time Monitoring
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced analytics and real-time vital monitoring with automated
                alerts for critical changes in patient conditions.
              </p>
              <div className="mt-6 flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                Learn more{" "}
                <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/50 p-8 rounded-xl transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center text-blue-400 mb-6 group-hover:from-blue-600/30 group-hover:to-blue-400/30 transition-colors duration-300">
                <FaCalendarAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Smart Scheduling
              </h3>
              <p className="text-gray-400 leading-relaxed">
                AI-powered scheduling system that optimizes appointment times
                and reduces patient wait times by 40%.
              </p>
              <div className="mt-6 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                Learn more{" "}
                <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-[#0D1117] border border-gray-800 hover:border-cyan-500/50 p-8 rounded-xl transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-600/20 to-cyan-400/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:from-cyan-600/30 group-hover:to-cyan-400/30 transition-colors duration-300">
                <FaCogs className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Workflow Automation
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Streamline repetitive tasks with custom automation workflows,
                reducing administrative burden by up to 65%.
              </p>
              <div className="mt-6 flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                Learn more{" "}
                <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/50 p-8 rounded-xl transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center text-blue-400 mb-6 group-hover:from-blue-600/30 group-hover:to-blue-400/30 transition-colors duration-300">
                <FaShieldAlt className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Secure Medical Records
              </h3>
              <p className="text-gray-400 leading-relaxed">
                HIPAA-compliant electronic health records with advanced
                encryption and intuitive access controls.
              </p>
              <div className="mt-6 flex items-center text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                Learn more{" "}
                <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-[#0D1117] border border-gray-800 hover:border-cyan-500/50 p-8 rounded-xl transition-all duration-300 group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-600/20 to-cyan-400/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:from-cyan-600/30 group-hover:to-cyan-400/30 transition-colors duration-300">
                <FaUsers className="text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-100">
                Patient Portal
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Empower patients with self-service tools including appointment
                scheduling, prescription refills, and secure messaging.
              </p>
              <div className="mt-6 flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                Learn more{" "}
                <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-l from-blue-600/5 to-cyan-400/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div
              variants={fadeIn}
              className="relative order-2 lg:order-1"
            >
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-48 bg-gradient-to-br from-blue-600/10 to-blue-400/10 rounded-lg flex items-center justify-center p-6 backdrop-blur-xl border border-blue-500/10">
                    <FaRegLightbulb className="text-blue-400 text-4xl" />
                  </div>
                  <div className="h-48 bg-gradient-to-br from-cyan-600/10 to-cyan-400/10 rounded-lg flex items-center justify-center p-6 backdrop-blur-xl border border-cyan-500/10">
                    <FaStethoscope className="text-cyan-400 text-4xl" />
                  </div>
                  <div className="h-48 bg-gradient-to-br from-cyan-600/10 to-cyan-400/10 rounded-lg flex items-center justify-center p-6 backdrop-blur-xl border border-cyan-500/10">
                    <FaHospital className="text-cyan-400 text-4xl" />
                  </div>
                  <div className="h-48 bg-gradient-to-br from-blue-600/10 to-blue-400/10 rounded-lg flex items-center justify-center p-6 backdrop-blur-xl border border-blue-500/10">
                    <FaHeartbeat className="text-blue-400 text-4xl" />
                  </div>
                </div>
                {/* Glow effects */}
                <div className="absolute -bottom-4 -right-4 bg-blue-400 h-24 w-24 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -top-4 -left-4 bg-cyan-400 h-24 w-24 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-cyan-400/20 text-cyan-400 text-xs font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Transforming Healthcare Through Technology
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                MediTech was founded with a clear vision: to transform
                healthcare delivery through innovative technology. Our platform
                bridges the gap between patients and providers, ensuring better
                access to care and improved health outcomes.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                With a team of healthcare professionals and technology experts,
                we've developed solutions that address the real challenges
                facing modern healthcare systems.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center text-blue-400 mr-4 flex-shrink-0">
                    <FaHospital className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 text-lg mb-1">
                      Hospital-wide Integration
                    </h4>
                    <p className="text-gray-400">
                      Seamless connection across all departments
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-600/20 to-cyan-400/20 flex items-center justify-center text-cyan-400 mr-4 flex-shrink-0">
                    <FaChartLine className="text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-100 text-lg mb-1">
                      Data-driven Insights
                    </h4>
                    <p className="text-gray-400">
                      Make informed decisions with real-time analytics
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/5 to-cyan-400/5 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-cyan-400/20 text-cyan-400 text-xs font-medium mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Built with Passion by Our Development Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from the engineers behind MediTech who made this platform
              possible.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-[#0D1117] rounded-xl p-8 border border-gray-800 hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="flex justify-start mb-6">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-500/20"
                  >
                    <path
                      d="M12 28C12 30 10 32 8 32C6 32 4 30 4 28C4 26 6 24 8 24C9 24 10 24 10 23C10 22 10 21 9 20C8 16 4 14 0 14V10C8 10 14 16 14 24C14 26 13 27 12 28ZM36 28C36 30 34 32 32 32C30 32 28 30 28 28C28 26 30 24 32 24C33 24 34 24 34 23C34 22 34 21 33 20C32 16 28 14 24 14V10C32 10 38 16 38 24C38 26 37 27 36 28Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <p className="text-gray-300 leading-relaxed mb-8">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mr-3">
                    <FaUserCircle className="text-blue-400 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-100">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default MediTechLanding;
