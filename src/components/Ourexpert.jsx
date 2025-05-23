// import React from "react";
// import { FaFacebook, FaTwitter, FaGooglePlus, FaLinkedin } from "react-icons/fa";

// // Import expert image
// import expertImage from "../assets/experts/artist1.jpg"; // Update the path if needed
// import { Link } from "react-router-dom";

// const Ourexpert = () => {
//   return (
//     <div className="max-w-7xl mx-auto flex flex-col">
//       <div className="w-full py-8 px-4 md:px-8 lg:px-12">
//         <div className="container">
//           {/* Title Section */}
//           <h1 className="text-center text-4xl font-roboto-slab font-medium text-custom-gray mb-12">
//             <span className="text-[#93C572]">Our</span> Expert Artists
//           </h1>

//           <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-8">
//             {/* Image Section */}
//             <div className="flex justify-center items-center">
//               <div
//                 className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105 hover:opacity-90"
//                 style={{ backgroundColor: "#93C572" }} // Theme color background for the image
//               >
//                 <img
//                   className="w-full h-full object-cover"
//                   src={expertImage}
//                   alt="Expert Artist"
//                 />
//               </div>
//             </div>

//             {/* Text Section */}
//             <div className="flex flex-col justify-center">
//               <h3 className="text-[28px] md:text-[35px] font-roboto-slab font-medium pb-[20px] md:pb-[35px] text-[#93C572]">
//                 Meet Melisa Bush
//               </h3>
//               <p className="text-base text-black leading-6 mb-4 md:mb-6">
//                 Melisa is an expert artist with years of experience in delivering high-quality artwork. She specializes in creating unique, hand-crafted designs that capture attention and resonate with viewers.
//               </p>
//               <p className="text-base text-black leading-6 mb-4 md:mb-6">
//                 With a passion for creativity and a focus on precision, Melisa brings a modern touch to traditional techniques. Her work has been showcased in various art exhibitions and admired by clients worldwide.
//               </p>

//               {/* Social Media Links */}
//               <div className="flex space-x-4 mb-4">
//                 <a
//                   href="#"
//                   className="text-[#9FE2BF] hover:text-[#93C572] transition duration-300"
//                   aria-label="Melisa Bush Facebook"
//                 >
//                   <FaFacebook size={24} />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-[#9FE2BF] hover:text-[#93C572] transition duration-300"
//                   aria-label="Melisa Bush Twitter"
//                 >
//                   <FaTwitter size={24} />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-[#9FE2BF] hover:text-[#93C572] transition duration-300"
//                   aria-label="Melisa Bush Google Plus"
//                 >
//                   <FaGooglePlus size={24} />
//                 </a>
//                 <a
//                   href="#"
//                   className="text-[#9FE2BF] hover:text-[#93C572] transition duration-300"
//                   aria-label="Melisa Bush LinkedIn"
//                 >
//                   <FaLinkedin size={24} />
//                 </a>
//               </div>

//               {/* Button */}
//                <div className="flex justify-center lg:justify-start md:justify-start sm:justify-center w-full">
//                 <Link
//                   to="#"
//                   className="inline-block bg-[#9FE2BF] hover:bg-[#93C572] text-black text-center font-roboto font-medium text-lg py-3 px-3 rounded border border-[#9FE2BF] transition duration-300 max-w-[150px] mt-4"
//                 >
//                   View More
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Ourexpert;

import React from "react";
import introImage from "../assets/about1.png"; // Replace with your best embroidery-related image

const Ourexpert = () => {
  return (
    <div className="py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div>
          <h1 className="text-center text-4xl font-roboto-slab font-medium text-custom-gray mb-12">
            <span className="text-[#93C572]">Em</span>broidery Digitizing
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At <span className="font-semibold text-[#65a938]">Quick Digitizing</span>, we specialize in delivering high-quality embroidery digitizing services with unmatched speed and precision. With over two decades of experience in the industry, we understand what it takes to bring your designs to life in thread.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Our team of seasoned digitizers combines artistry with technical expertise to ensure every stitch is perfectly placed, resulting in clean, crisp embroidery every time.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Whether it’s a logo, patch, or complex artwork, our process ensures fast turnarounds—often within 24 hours—while maintaining unmatched quality.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Experience the perfect blend of speed, quality, and service. Partner with us today and let’s create something beautiful together.
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full">
          {/* <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <img
              src={introImage}
              alt="Embroidery Digitizing"
              className="w-full h-full object-cover"
            />
          </div> */}
          {/* Image Section */}
          <div className="w-full">
            <div className="flex flex-col overflow-hidden">
              <img
                className="rounded-lg transform transition-transform duration-500 ease-in-out hover:scale-110 w-full h-auto object-cover max-h-[30rem]"
                src={introImage} // Updated to use imported image
                alt="About us"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Ourexpert;
