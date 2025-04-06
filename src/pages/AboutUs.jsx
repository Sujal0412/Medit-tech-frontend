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

const AboutUs = () => {
  const stats = [
    { number: "10+", text: "Years Experience" },
    { number: "50+", text: "Healthcare Partners" },
    { number: "1000+", text: "Patients Served" },
    { number: "24/7", text: "Support Available" },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      title: "Patient-Centric",
      description: "Putting patients first in everything we do",
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Quality Care",
      description: "Maintaining highest standards in healthcare delivery",
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Efficiency",
      description: "Optimizing healthcare processes for better outcomes",
    },
    {
      icon: <Award className="w-8 h-8 text-blue-600" />,
      title: "Excellence",
      description: "Striving for excellence in healthcare management",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            About MediTech
          </h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            Revolutionizing healthcare management through innovative technology
            solutions
          </p>
        </div>
      </div>

      {/* Stats Section */}

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-6">
                At MediTech, we're committed to transforming healthcare
                management through innovative technology solutions. Our mission
                is to streamline healthcare operations, reduce waiting times,
                and improve patient experiences.
              </p>
              <ul className="space-y-4">
                {[
                  "Efficient queue management system",
                  "Real-time bed tracking solutions",
                  "Smart scheduling and resource allocation",
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img src="/p-5.jpg" alt="Healthcare Mission" className="" />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of healthcare facilities already using MediTech to
            improve their operations
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
