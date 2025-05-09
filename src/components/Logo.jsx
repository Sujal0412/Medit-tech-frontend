import React from "react";

const Logo = ({ className, font }) => (
  <div className={`flex items-center ${className}`}>
    <span className={`font-bold ${font}`}>
      <span
        className={`bg-clip-text ${className} text-transparent bg-gradient-to-r from-blue-400 to-cyan-400`}
      >
        Medi<span className={`text-white ${className}`}>Tech</span>
      </span>
    </span>
  </div>
);

export default Logo;
