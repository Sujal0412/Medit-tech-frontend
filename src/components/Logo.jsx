import React from "react";

const Logo = ({ className, font }) => (
  <div className={`flex items-center ${className}`}>
    <span className={`font-bold text-blue-600 ${font}`}>
      Medi<span className="text-teal-500">Tech</span>
    </span>
  </div>
);

export default Logo;
