// import React from "react";
// import { SectionTitle } from "../components";
// import about from "../assets/about.jpg";

// const Service = () => {
//   return (
//     <div className="bg-gray-100">
//       {/* Section title */}
//       <SectionTitle title="Service" path="Home > Service" />
      
//       <div className="max-w-7xl  flex flex-col mx-auto px-4">
//         <div className="w-full">
//           <div className="container flex flex-col items-center gap-16 mx-auto mb-12 mt-12">
            
//             {/* First Row of Services */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
//               <ServiceItem
//                 icon="fa-signal"
//                 title="Free Delivery"
//                 description="We offer free delivery for all our services. Enjoy a fast, secure, and reliable delivery service."
//               />
//               <ServiceItem
//                 icon="fa-home"
//                 title="24 Hour Support"
//                 description="Our customer service is available 24 hours a day to help you with all your questions and concerns."
//               />
//               <ServiceItem
//                 icon="fa-money"
//                 title="100% Money Back"
//                 description="We offer a 100% money-back guarantee if you’re not satisfied with the quality of our work."
//               />
//             </div>

//             {/* Second Row of Services */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8">
//               <ServiceItem
//                 icon="fa-road"
//                 title="Packaging"
//                 description="We provide premium packaging solutions to ensure your goods are delivered safely."
//               />
//               <ServiceItem
//                 icon="fa-heart"
//                 title="Fast Delivery"
//                 description="We offer fast delivery services to ensure your products are delivered on time, every time."
//               />
//               <ServiceItem
//                 icon="fa-bandcamp"
//                 title="Quality Work"
//                 description="Our expert team delivers high-quality work, ensuring customer satisfaction with every order."
//               />
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ServiceItem Component with Tailwind CSS and new colors
// const ServiceItem = ({ icon, title, description }) => {
//   return (
//     <div className="flex flex-col text-center items-center">
//       {/* Icon container with hover effect */}
//       <div className="w-20 h-20 rounded-full border border-[#65a938] flex items-center justify-center transform transition-transform duration-500 ease-in-out hover:scale-110">
//         <i className={`fa ${icon} text-[#222a1c] text-3xl`} />
//       </div>
      
//       {/* Title */}
//       <h3 className="text-2xl font-semibold mt-4 mb-2 text-[#93C572]">
//         {title}
//       </h3>
      
//       {/* Description */}
//       <p className="text-base leading-6 text-black">
//         {description}
//       </p>
//     </div>
//   );
// };

// export default Service;



import React from "react";
import { SectionTitle } from "../components";
import { FaStar, FaEdit, FaTruck } from "react-icons/fa"; 
import { PiNeedle } from "react-icons/pi";

const Service = () => {
  return (
    <div className="bg-gray-100">
      {/* Section title */}
      <SectionTitle title="Service" path="Home > Service" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <ServiceItem
            icon={<FaTruck className="text-3xl text-white" />}
            title="Fast Delivery"
            description="Most orders are completed within 24 hours. You get what you need, when you need it."
          />
          <ServiceItem
            icon={<FaStar className="text-3xl text-white" />}
            title="Quality Work"
            description="Our expert digitizers deliver high-quality work, ensuring satisfaction every time."
          />
          <ServiceItem
            icon={<FaEdit className="text-3xl text-white" />}
            title="Free & Fast Edits"
            description="Keep your projects moving—edits are quick, free, and hassle-free."
          />
          <ServiceItem
             icon={<PiNeedle  className="text-3xl text-white" />}
            title="Embroidery Patch"
            description="Turn digitized designs into premium patches—low minimums, high quality."
          />
        </div>
      </div>
    </div>
  );
};

const ServiceItem = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300 text-center flex flex-col items-center">
      {/* Icon circle */}
      <div className="w-20 h-20 flex items-center justify-center bg-[#65a938] rounded-full shadow-md mb-5 hover:scale-110 transition-transform duration-300 ease-in-out">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[#222a1c] mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 text-base leading-relaxed">{description}</p>
    </div>
  );
};

export default Service;
