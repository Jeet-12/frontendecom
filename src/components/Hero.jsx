// 

import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="relative bg-hero-pattern bg-cover bg-center bg-no-repeat h-[700px] md:h-[600px] sm:h-[450px] flex items-center justify-center"
      style={{ backgroundBlendMode: "overlay" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      {/* Content */}
      <div className="relative text-center px-4 animate-fadeIn">
        <h1 className="text-6xl text-[#93C572] md:text-8xl font-great-vibes mb-4"
            >
          Quick Digitizing
        </h1>
        <h2 className="text-3xl text-[#AFE1AF] md:text-4xl font-roboto-slab mb-6"
        >
          PROFESSIONAL DIGITIZING YOU CAN COUNT ON 
        </h2>
        <p className="text-lg md:text-2xl text-[#9FE2BF] mb-8"
           >
          {/* Add descriptive text here if needed */}
        </p>
        {/* <Link
          to="/contact"
          className="inline-block hover:bg-[#93C572] text-white font-roboto font-medium text-lg md:text-xl py-3 px-8 rounded border border-[#93C572] transition duration-300"
        >
          Contact
        </Link> */}
      </div>
    </div>
  );
};

export default Hero;
