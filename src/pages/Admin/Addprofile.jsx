import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChangePassword from './ChangePassword';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ordersCount, setOrdersCount] = useState(0);
  const [quotationsCount, setQuotationsCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const headers = { 'x-auth-token': token };

        // Fetch user profile
        const userRes = await axios.get(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/auth/authorization`, { headers });
        setUser(userRes.data.user);

        // Fetch orders
        const orderRes = await axios.get(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/order/`, { headers });
        setOrdersCount(orderRes.data?.length || 0);

        // Fetch quotations
        const quoteRes = await axios.get(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/quotation`, { headers });
        setQuotationsCount(quoteRes.data?.length || 0);

        // Fetch customers
        const usersRes = await axios.get(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/auth/users`, { headers });

      const userData = Array.isArray(usersRes.data)
        ? usersRes.data
        : Array.isArray(usersRes.data.users)
          ? usersRes.data.users
          : [];

      setCustomersCount(userData.length);

        setLoading(false);
      } catch (err) {
        const status = err.response?.status;

        if (status === 401) {
          localStorage.clear();
          alert('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        console.error('Error:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <div className="flex items-center justify-center w-32 h-32 rounded-full bg-[#93C572] text-white text-3xl font-bold border-4 border-[#93C572] shadow-lg">
            {getInitials(`${user.firstname} ${user.lastname}`)}
          </div>
        </div>
        <div className="md:ml-8 w-full">
          <h2 className="text-3xl font-bold text-[#93C572]">
            {user.firstname} {user.lastname}
          </h2>
          <p className="mt-2 text-lg text-gray-700">{user.email}</p>
          <p className="mt-1 text-lg text-gray-700 capitalize">Role: {user.role}</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Orders" value={ordersCount} />
        <StatCard label="Sales" value="$15,340" />
        <StatCard label="Quotations" value={quotationsCount} />
        <StatCard label="Customers" value={customersCount} />
      </div>

      {/* Activity Log */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">Recent Activities</h3>
        <ul className="mt-4 space-y-3">
          {['Processed order', 'Updated product pricing', 'Resolved customer query', 'Added a new product'].map((activity, index) => (
            <li key={index} className="p-3 bg-[#f8fafc] rounded-md hover:bg-gray-100 transition">
              {activity}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Insights */}
      <div className="mb-6 mt-4">
        <h3 className="text-2xl font-semibold text-gray-700">AI Insights</h3>
        <div className="p-4 bg-gradient-to-r from-[#93C572] to-[#7CB260] text-white rounded-lg shadow-md mt-4">
          <p>Top-Selling Product: Green Tea Maker</p>
          <p>Customer Retention: 87%</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="mt-8">
        <button
          className="px-4 py-2 bg-[#93C572] text-white rounded-md hover:bg-[#7CB260] transition duration-300 shadow-md"
          onClick={() => setIsChangePasswordOpen(true)}
        >
          Change Password
        </button>
      </div>

      <ChangePassword
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        userId={user._id}
        token={localStorage.getItem('token')}
      />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="p-4 bg-[#f8fafc] rounded-lg shadow hover:shadow-md transition">
    <h3 className="text-xl font-semibold text-[#93C572]">{value}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default UserProfile;
