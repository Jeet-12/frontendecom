import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom'; 
import { toast } from "react-toastify";
import { fetchWithAuth } from '../Services/fetchWithAuth';

const ChangePasswordPage = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get('token'); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      
      const response = fetchWithAuth(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/auth/reset-password/${tokenId}`,
        {password:newPassword}
      ) ;
        setNewPassword('');
        setConfirmPassword('');
        toast.success("Password reset successfull")
        navigate("/login");
     
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        localStorage.clear();
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to change password. Please try again.' )
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
