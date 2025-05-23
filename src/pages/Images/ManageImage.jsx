import React, { useState } from 'react';
import UploadImage from './UploadImage'; // Assuming UploadImage is in the same directory
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa'; // Importing icons for additional features

const ManageImage = () => {
    const [uploadedImages, setUploadedImages] = useState([
        {
            file: "https://img.freepik.com/premium-photo/wide-angle-shot-single-tree-growing-clouded-sky-sunset-surrounded-by-grass_181624-22807.jpg?semt=ais_hybrid", // Placeholder for an actual file
            code: "IMG001",
            stitch: "Stitch A",
            width: 800,
            height: 600,
        },
        {
            file: "https://img.freepik.com/premium-photo/wide-angle-shot-single-tree-growing-clouded-sky-sunset-surrounded-by-grass_181624-22807.jpg?semt=ais_hybrid", // Placeholder for an actual file
            code: "IMG002",
            stitch: "Stitch B",
            width: 1024,
            height: 768,
        },
    ]);

    const handleUpload = (newImage) => {
        setUploadedImages((prevImages) => [...prevImages, newImage]);
    };

    const handleDelete = (index) => {
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Uploaded Images</h2>
                {uploadedImages.length === 0 ? (
                    <p className="text-gray-600">No images uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedImages.map((image, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-md p-4 transition-transform transform hover:scale-105 hover:shadow-2xl shadow-md">
                                <img
                                    src={image.file} // Display the uploaded image
                                    alt={image.code}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                />
                                <h3 className="font-bold text-lg">{image.code}</h3>
                                <p>Stitch: {image.stitch}</p>
                                <p>Width: {image.width}</p>
                                <p>Height: {image.height}</p>
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="text-red-500 hover:text-red-700 transition duration-200"
                                        title="Delete Image"
                                    >
                                        <FaTrash />
                                    </button>
                                    <button
                                        className="text-blue-500 hover:text-blue-700 transition duration-200"
                                        title="View Image"
                                        // onClick={() => window.open(image.file, '_blank')}
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageImage;
