// import React from "react";
// import { SectionTitle } from "../components";

// const Gallery = () => {
//   // Function to prevent right-click and drag-and-drop
//   const handleContextMenu = (e) => {
//     e.preventDefault();
//   };

//   const handleDragStart = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div className="bg-gray-100">
//       {/* Section Title */}
//       <SectionTitle title="Gallery" path="Home > Gallery" />
//       <div className="max-w-7xl flex flex-col mx-auto">
//         <div className="w-full">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-5">
//             {/* First Column */}
//             <div className="grid gap-4">
//               <div className="bg-[#93C572] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/B-01.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#AFE1AF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/B-02.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#9FE2BF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/B-03.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//             </div>

//             {/* Second Column */}
//             <div className="grid gap-4">
//               <div className="bg-[#93C572] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/B-04.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#AFE1AF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/B-05.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#9FE2BF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/B-06.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//             </div>

//             {/* Third Column */}
//             <div className="grid gap-4">
//               <div className="bg-[#93C572] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/C-07.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#AFE1AF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/CH-08.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#9FE2BF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/D-09.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//             </div>

//             {/* Fourth Column */}
//             <div className="grid gap-4">
//               <div className="bg-[#93C572] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/D-010.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#AFE1AF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/EF-011.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//               <div className="bg-[#9FE2BF] overflow-hidden rounded-lg p-2 relative">
//                 <div className="absolute inset-0 z-10"></div> {/* Transparent overlay */}
//                 <img
//                   className="h-auto max-w-full rounded-lg border transform transition-transform duration-500 ease-in-out hover:scale-110 no-download"
//                   src="../assets/gallery/F-012.webp"
//                   alt="Gallery Item"
//                   onContextMenu={handleContextMenu}
//                   onDragStart={handleDragStart}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
    
//   );
// };

// export default Gallery;



import React, { useEffect, useState } from "react";
import { SectionTitle } from "../components";
import axios from "axios";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState([]);

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchGalleryImages = async () => {
      try {
        const headers = { 'x-auth-token': token };
        const response = await axios.get("http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/gallery", { headers });
        setGalleryImages(response.data || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <SectionTitle title="Gallery" path="Home > Gallery" />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-full h-[300px] overflow-hidden flex items-center justify-center bg-gray-200">
                <img
                  src={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${image.image}`}
                  alt={image.name || `Gallery Item ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onContextMenu={handleContextMenu}
                  onDragStart={handleDragStart}
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
