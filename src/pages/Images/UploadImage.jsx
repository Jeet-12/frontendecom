import React, { useState } from 'react';

const UploadImage = () => {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [code, setCode] = useState('');
    const [stitch, setStitch] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle the image upload logic here
        // console.log('Image:', image);
        // console.log('File:', file);
        // console.log('Code:', code);
        // console.log('Stitch:', stitch);
        // console.log('Width:', width);
        // console.log('Height:', height);
        
        // Here you can add your upload logic, e.g., sending data to an API

        // Reset form
        setImage(null);
        setFile(null);
        setCode('');
        setStitch('');
        setWidth('');
        setHeight('');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Image</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Image (.gif only)</label>
                        <button
                            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 flex justify-center items-center cursor-pointer hover:bg-gray-200"
                            onClick={() => document.getElementById('imageInput').click()}
                        >
                            <span className="text-gray-700 font-semibold">Upload</span>
                            <input
                                id="imageInput"
                                type="file"
                                accept=".gif"
                                onChange={handleImageChange}
                                className="hidden"
                                required
                            />
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">File (.zip only)</label>
                        <button
                            className="w-full bg-gray-100 border border-gray-300 rounded-md p-2 flex justify-center items-center cursor-pointer hover:bg-gray-200"
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <span className="text-gray-700 font-semibold">Upload</span>
                            <input
                                id="fileInput"
                                type="file"
                                accept=".zip"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </button>
                    </div>
                    <div>
                        <label className="block text-gray-700">Code</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Stitch</label>
                        <input
                            type="text"
                            value={stitch}
                            onChange={(e) => setStitch(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="block text-gray-700">Width</label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700">Height</label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white font-bold py-2 rounded-md hover:bg-green-600 transition duration-200"
                        style={{backgroundColor: 'rgb(147, 197, 114)'}}
                    >
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadImage;
