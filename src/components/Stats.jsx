import React from "react";
import { Link } from "react-router-dom";
import about from "../assets/about.jpg"; // Ensure the path is correct

const Stats = () => {
  return (
    <div className="max-w-7xl  mx-auto flex flex-col px-4">
      <div className="w-full">
        <div className="container mx-auto my-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="flex flex-col overflow-hidden">
              <img
                className="rounded-lg transform transition-transform duration-500 ease-in-out hover:scale-110"
                src={about} // Updated to use imported image
                alt="About us"
              />
            </div>

            {/* Text Section */}
            <div className="flex flex-col justify-center items-start lg:items-start md:items-start sm:items-center text-center lg:text-left md:text-left sm:text-center">
              <h3
                className="text-[35px] font-roboto-slab font-medium pb-[35px] text-[#93C572]"
              >
                Welcome to Quick Digitizing
              </h3>
              <p
                className="text-lg text-gray-700 leading-relaxed mb-4"
              >
                We provide high quality Embroidery Digitizing at an affordable
                price. With over 20 years experience in the embroidery industry,
                we fully understand the needs of the modern embroidery industry:
                Providing high quality product at a reasonable price and in a
                timely manner.
              </p>
              <p
                className="text-lg text-gray-700 leading-relaxed mb-4"
              >
                Our team of digitizing experts is here to provide you with just
                that! Try our service, we are certain that you will enjoy our
                quick and reliable service.
              </p>
              
              {/* Button Section */}
              <div className="flex justify-center lg:justify-start md:justify-start sm:justify-center w-full">
                <Link
                  to="/shop"
                  className="inline-block bg-[#9FE2BF] hover:bg-[#93C572] text-black text-center font-roboto font-medium text-lg py-3 px-3 rounded border border-[#9FE2BF] transition duration-300 max-w-[150px] mt-4"
                >
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
