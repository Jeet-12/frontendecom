import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';  // ✅ Only import toast
import 'react-toastify/dist/ReactToastify.css';  // (optional here, should already be imported globally)
import { fetchWithAuth } from '../../Services/fetchWithAuth';

const AddGallery = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const token = localStorage.getItem("token");

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      toast.error('Please select a valid JPEG, JPG, or PNG image.');
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('⚠️ No file selected.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('galleryImage', file); 

    try {
      const response = await axios.post(
        'http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/gallery/upload',
        formData,
        {
          headers: {
            'x-auth-token': token
          },
        }
      );
      console.log(response);
     if (response.status === 200 || response.status === 201) {
      toast.success('Image uploaded successfully!');
      setFile(null);
      setPreview(null);
    } else {
      const message = response.data?.message || 'Unexpected response from server.';
      toast.error(`Upload failed: ${message}`);
    }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDivClick = () => {
    inputRef.current.click(); 
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Gallery Image</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Preview */}
          {preview && (
            <div className="flex justify-center mb-4">
              <img src={preview} alt="Selected" className="h-48 rounded-md object-cover shadow" />
            </div>
          )}

          {/* Hidden File Input and Custom Upload Area */}
          <div
            onClick={handleDivClick}
            className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 p-8 rounded-lg hover:border-blue-500 cursor-pointer transition"
          >
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/jpg,image/png"
              style={{ display: 'none' }}
            />
            <p className="text-gray-400">Click here to select an image</p>
            <p className="text-xs text-gray-400 mt-1">Only JPEG, JPG, PNG allowed</p>
          </div>

          {/* Upload Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!file || loading}
              className={`px-6 py-2 rounded text-white font-semibold transition ${
                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddGallery;
