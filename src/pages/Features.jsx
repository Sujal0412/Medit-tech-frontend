import React from 'react';
import { Clock, Bed, Package, BarChart2 } from 'lucide-react';

const features = [
  { title: "Smart OPD Queue", desc: "Reduce wait times by up to 40%", icon: <Clock className="text-blue-600 w-10 h-10" /> },
  { title: "Real-time Bed Tracking", desc: "Monitor hospital bed status", icon: <Bed className="text-blue-600 w-10 h-10" /> },
  { title: "Inventory Management", desc: "Track medicines with AI alerts", icon: <Package className="text-blue-600 w-10 h-10" /> },
  { title: "Advanced Analytics", desc: "Gain insights for efficiency", icon: <BarChart2 className="text-blue-600 w-10 h-10" /> }
];

const Features = () => {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Features</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Explore our powerful hospital management solutions.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {features.map((feature, index) => (
          <div key={index} 
            className="bg-white/80 backdrop-blur-lg shadow-xl rounded-lg p-6 text-center border border-gray-200
                       hover:shadow-2xl transition-all hover:scale-105 hover:border-blue-500"
          >
            <div className="w-16 h-16 mx-auto bg-blue-100 flex items-center justify-center rounded-full shadow-md">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mt-4">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
