import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const GalleryList = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/gallery', {
        headers: {
          'x-auth-token': token
        }
      });
      setGallery(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('❌ Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await axios.delete(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/gallery/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      toast.success('✅ Image deleted successfully!');
      fetchGallery();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('❌ Failed to delete image.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Gallery List</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="px-2 py-2 border w-16">#</th> {/* <-- Smaller width */}
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {gallery.length > 0 ? (
                  gallery.map((item, index) => (
                    <tr key={item._id} className="text-center">
                      <td className="px-2 py-2 border">{index + 1}</td> {/* <-- Smaller padding */}
                      <td className="px-4 py-2 border">
                        <img
                          src={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${item.image}`}
                          alt="Gallery"
                          className="h-20 w-20 object-cover mx-auto rounded-md shadow"
                          crossOrigin="anonymous"
                        />
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center">
                      No images found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryList;
