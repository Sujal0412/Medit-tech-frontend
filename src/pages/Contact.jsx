import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import {
  FaArrowRight,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaAngleRight,
} from "react-icons/fa";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      // Reset form after submission
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 1000);
  };

  const faqs = [
    {
      question: "How do I schedule an appointment?",
      answer:
        "You can schedule an appointment through our online portal, by calling our customer service, or by visiting our facility in person. Our team will help you find the most convenient time slot.",
    },
    {
      question: "What insurance plans do you accept?",
      answer:
        "We accept most major insurance plans including BlueCross BlueShield, Aetna, Cigna, UnitedHealthcare, Medicare, and Medicaid. Please contact us to verify your specific coverage.",
    },
    {
      question: "How do I access my medical records?",
      answer:
        "You can access your medical records through our secure patient portal. If you need assistance, our medical records department can help you with the process during business hours.",
    },
    {
      question: "What should I bring to my first appointment?",
      answer:
        "Please bring your ID, insurance card, a list of current medications, any relevant medical records or test results, and a list of questions you may have for the healthcare provider.",
    },
  ];

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-blue-400" />,
      title: "Email Us",
      details: "support@mediqueue.com",
      link: "mailto:support@mediqueue.com",
    },
    {
      icon: <FaPhoneAlt className="text-cyan-400" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <FaMapMarkerAlt className="text-blue-400" />,
      title: "Visit Us",
      details: "123 Healthcare Ave, Medical District, NY 10001",
      link: "https://maps.google.com",
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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4"
            >
              Get In Touch
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
            >
              Contact{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                MediQueue
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Have questions or need support? Our team is here to help you with
              any inquiries about our healthcare queue management system.
            </motion.p>
          </div>

          {/* Contact cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {contactInfo.map((item, index) => (
              <motion.a
                href={item.link}
                key={index}
                variants={fadeIn}
                className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/30 rounded-xl p-6 text-center transition-all duration-300 group"
                target={item.title === "Visit Us" ? "_blank" : "_self"}
                rel="noopener noreferrer"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 mb-3">{item.details}</p>
                <span className="text-sm text-blue-400 flex items-center justify-center gap-1 group-hover:text-blue-300">
                  {item.title === "Visit Us" ? "View Map" : "Contact Now"}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Information */}
      <section className="py-24 relative">
        <div className="absolute top-40 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-blue-600/10 to-cyan-400/10 blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16"
          >
            {/* Contact Form */}
            <motion.div variants={fadeIn}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 text-blue-400 text-xs font-medium mb-4">
                Send A Message
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-100">
                We'd Love to Hear From You
              </h2>
              <p className="text-gray-400 mb-8">
                Fill out the form below and our team will get back to you as
                soon as possible.
              </p>

              <div className="bg-[#0D1117] border border-gray-800 rounded-xl p-8">
                {isSubmitted ? (
                  <div className="flex flex-col items-center text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 flex items-center justify-center mb-4">
                      <CheckCircle className="text-green-400 w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-gray-400">
                      Thank you for contacting us. We'll respond shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-300 mb-2"
                          htmlFor="name"
                        >
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#171B24] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-300 mb-2"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-[#171B24] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-300 mb-2"
                        htmlFor="subject"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-[#171B24] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-300 mb-2"
                        htmlFor="message"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg bg-[#171B24] border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Please provide details about your inquiry..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center group"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Map/Image */}
            <motion.div variants={fadeIn}>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-cyan-400/20 text-cyan-400 text-xs font-medium mb-4">
                Our Location
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-100">
                Visit Our Headquarters
              </h2>
              <p className="text-gray-400 mb-8">
                Meet with our team in person at our modern office facility.
              </p>

              <div className="relative">
                <div className="rounded-xl bg-gradient-to-r p-[1px] from-blue-500 to-cyan-400">
                  <div className="rounded-xl bg-[#0D1117] p-1.5 backdrop-blur-3xl">
                    <div className="aspect-video rounded-lg bg-[#171B24] flex items-center justify-center overflow-hidden">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mx-auto flex items-center justify-center mb-6">
                          <MapPin className="text-white text-xl" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-100 mb-2">
                          MediQueue Headquarters
                        </h3>
                        <p className="text-gray-400 mb-6">
                          123 Healthcare Avenue
                          <br />
                          Medical District, NY 10001
                          <br />
                          United States
                        </p>
                        <div className="flex justify-center space-x-6">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Business Hours
                            </div>
                            <div className="text-gray-300">
                              Mon-Fri: 9AM-5PM
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">
                              Support Hours
                            </div>
                            <div className="text-gray-300">24/7 Available</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-400 rounded-full opacity-20 blur-xl"></div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/30 rounded-lg p-4 flex items-center justify-between transition-all duration-300 group"
                >
                  <span className="text-gray-300">View on Google Maps</span>
                  <ExternalLink className="text-blue-400 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="tel:+15551234567"
                  className="bg-[#0D1117] border border-gray-800 hover:border-cyan-500/30 rounded-lg p-4 flex items-center justify-between transition-all duration-300 group"
                >
                  <span className="text-gray-300">Call for Directions</span>
                  <Phone className="text-cyan-400 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
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
              FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-100">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find quick answers to common questions about our services
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-[#0D1117] border border-gray-800 hover:border-blue-500/30 p-6 rounded-xl transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-100 mb-3 flex items-start">
                  <div className="h-6 w-6 rounded bg-gradient-to-br from-blue-600/20 to-blue-400/20 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <MessageSquare className="w-3 h-3 text-blue-400" />
                  </div>
                  {faq.question}
                </h3>
                <p className="text-gray-400 ml-9">{faq.answer}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors"
            >
              View More Questions{" "}
              <FaAngleRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNncmlkKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full opacity-10 blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
