import React from "react";
import { SectionTitle, Chooseus, Testimonial, Ourexpert } from "../components";
import about from '../assets/about.jpg';

const About = () => {
  return (
    <div className="bg-gray-100 ">
      {/* Section title */}
      <SectionTitle title="About Us" path="Home > About" />
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="w-full py-8 px-4 md:px-8 lg:px-12">
          <div className="container ">
            <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-8">
              
              {/* Image section */}
              <div className="flex flex-col overflow-hidden">
                <img
                  className="rounded-lg transform transition-transform duration-500 ease-in-out hover:scale-110"
                  src={about}
                  alt="About Quick Digitizing"
                />
              </div>

              {/* Text section with new colors */}
              <div className="flex flex-col">
                <h3 className="text-[35px] text-[#93C572] font-roboto-slab font-medium pb-[35px]">
                  Welcome to Quick Digitizing
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                  {/* We provide high quality Embroidery Digitizing at an affordable price. With over 20 years of experience in the embroidery industry, we fully understand the needs of the modern embroidery industry: providing high quality products at a reasonable price and in a timely manner. */}
                  Quick Digitizing is your go-to source for fast, high-quality embroidery digitizing. With years of industry experience, we combine expert craftsmanship with the latest technology to deliver stitch-ready files you can count on. We’re proud to offer 24-hour turnaround times, professional results, and reliable customer support.
                </p>
                {/* <p className="text-base text-black leading-6 mb-6">
                  Our team of digitizing experts is here to provide you with just that! Try our service, and we are certain that you will enjoy our quick and reliable service.
                </p> */}
              </div>
            </div>
          </div>
        </div>
             <Ourexpert/>
               {/* Chooseus section */}
        <Chooseus />
      </div>
    </div>
  );
};

export default About;
