import React from "react";
import {
  Briefcase,
  Users,
  Target,
  CheckCircle,
  Heart,
  Award,
  Clock,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
import { FaArrowRight, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const stats = [
    { number: "10+", text: "Years Experience" },
    { number: "50+", text: "Healthcare Partners" },
    { number: "1000+", text: "Patients Served" },
    { number: "24/7", text: "Support Available" },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-blue-400" />,
      title: "Patient-Centric",
      description: "Putting patients first in everything we do",
    },
    {
      icon: <Shield className="w-8 h-8 text-cyan-400" />,
      title: "Quality Care",
      description: "Maintaining highest standards in healthcare delivery",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-400" />,
      title: "Efficiency",
      description: "Optimizing healthcare processes for better outcomes",
    },
    {
      icon: <Award className="w-8 h-8 text-cyan-400" />,
      title: "Excellence",
      description: "Striving for excellence in healthcare management",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-100">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-blue-500/5 to-transparent"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-400/20 blur-3xl"></div>
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-l from-indigo-600/10 to-purple-400/10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4"
            >
              About MediQueue
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
            >
              Transforming{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Healthcare
              </span>{" "}
              Management
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-8"
            >
              Revolutionizing healthcare operations through innovative
              technology solutions that improve patient care and streamline
              clinical workflows.
            </motion.p>
          </div>
        </div>

        {/* Stats section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-[#0D1117] border border-gray-800 rounded-xl p-6 backdrop-blur-xl text-center"
              >
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400 mt-2">{stat.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 relative">
        <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-blue-600/10 to-cyan-400/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-5 gap-16"
          >
            <motion.div variants={fadeIn} className="lg:col-span-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Pioneering the Future of Healthcare Technology
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                At MediQueue, we're committed to transforming healthcare
                management through innovative technology solutions. Our mission
                is to streamline healthcare operations, reduce waiting times,
                and improve patient experiences through our intelligent queue
                management system.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                We believe that technology can bridge critical gaps in
                healthcare delivery, creating more efficient systems that
                benefit both providers and patients. Our platform is designed to
                optimize resource allocation, improve communication, and enable
                data-driven decision making.
              </p>

              <div className="space-y-4">
                {[
                  "Intelligent queue management system",
                  "Real-time bed tracking solutions",
                  "Smart scheduling and resource allocation",
                  "Data-driven operational insights",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="flex items-center space-x-3"
                  >
                    <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="lg:col-span-2 relative">
              <div className="relative">
                <div className="rounded-xl bg-gradient-to-r p-[1px] from-blue-500 to-cyan-400">
                  <div className="rounded-xl bg-[#0D1117] p-1.5 backdrop-blur-3xl h-full">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-blue-600/10 to-cyan-400/10 flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mx-auto flex items-center justify-center mb-6">
                          <Target className="text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-100 mb-3">
                          Vision Statement
                        </h3>
                        <p className="text-gray-400">
                          "To create a healthcare ecosystem where waiting times
                          are minimized, resources are optimized, and patient
                          care is elevated through smart technology solutions."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-400 rounded-full opacity-20 blur-xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#09090D] relative">
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
              Our Core Values
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Principles That Guide Us
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our core values shape everything we do, from product development
              to customer service
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/30 p-8 rounded-xl transition-all duration-300 group"
              >
                <div className="mb-5">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mb-6 group-hover:from-blue-600/30 group-hover:to-blue-400/30 transition-colors duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-100">
                  {value.title}
                </h3>
                <p className="text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Glimpse */}
      <section className="py-24 relative">
        <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-blue-600/10 to-cyan-400/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4">
              Our Team
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              The People Behind MediQueue
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A diverse team of healthcare experts, engineers, and designers
              working together to transform healthcare
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-3xl">
              <div className="rounded-xl bg-gradient-to-r p-[1px] from-blue-500 to-cyan-400">
                <div className="rounded-xl bg-[#0D1117] p-8 backdrop-blur-3xl">
                  <div className="text-center">
                    <div className="flex justify-center mb-8">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center">
                        <Users className="text-blue-400 text-2xl" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-100 mb-4">
                      A Collective of Innovators
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Our team brings together decades of combined experience in
                      healthcare technology, clinical practice, and user
                      experience design. We're united by a common goal: to make
                      healthcare more accessible, efficient, and human-centered.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 rounded-lg h-16 flex items-center justify-center text-blue-400">
                        Healthcare Experts
                      </div>
                      <div className="bg-gradient-to-br from-cyan-600/10 to-cyan-400/10 rounded-lg h-16 flex items-center justify-center text-cyan-400">
                        Engineers
                      </div>
                      <div className="bg-gradient-to-br from-blue-600/10 to-blue-400/10 rounded-lg h-16 flex items-center justify-center text-blue-400">
                        UX Designers
                      </div>
                    </div>
                    <Link to="/contact">
                      <button className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors group">
                        Meet Our Team{" "}
                        <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
