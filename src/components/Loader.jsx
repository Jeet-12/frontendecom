// src/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
        <h2 className="text-lg font-semibold text-gray-700">
          Loading products...
        </h2>
        <p className="text-sm text-gray-500">Please wait while we fetch the data for you.</p>
      </div>
    </div>
  );
};

export default Loader;
