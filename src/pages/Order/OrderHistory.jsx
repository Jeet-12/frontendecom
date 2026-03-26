import React, { useEffect, useState } from "react";
import { SectionTitle } from "../../components";
import { Link, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { FaEye, FaStitch, FaRulerCombined, FaPalette, FaCheckCircle, FaClock, FaHistory } from "react-icons/fa";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const noOrdersImage = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg";

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated.");
        }

        const response = await fetch(
          `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/order/completed-and-paid-orders`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 404 || (errorData.orders && errorData.orders.length === 0)) {
            setOrders([]);
            setLoading(false);
            return;
          }
          throw new Error(errorData.message || "Failed to fetch orders.");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        if (err.message.includes("No orders found") || err.message.includes("404")) {
          setOrders([]);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaidOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your order history...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <SectionTitle title="Order History" path="Home | Order History" />
        
        <div className="mt-8">
          {orders.length === 0 ? (
            <NoOrders imageUrl={noOrdersImage} />
          ) : (
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FaHistory className="text-green-500" /> Recent Activity
                  </h2>
                  <p className="text-sm text-gray-500">You have {orders.length} completed orders</p>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-100">
                  All Records Synced
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <OrderCard key={order._id || nanoid()} order={order} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NoOrders = ({ imageUrl }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-20 px-4 text-center">
    <div className="bg-gray-50 rounded-full p-8 mb-8">
        <img 
          src={imageUrl} 
          alt="No orders found" 
          className="w-48 h-48 object-contain mix-blend-multiply opacity-80"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
          }}
        />
    </div>
    <h1 className="text-2xl font-bold text-gray-800 mb-2">
      No Orders Found
    </h1>
    <p className="text-gray-500 mb-8 max-w-sm">
      It looks like you haven't placed any orders yet. Once you complete a purchase, it will appear here.
    </p>
    <Link
      to="/order/form"
      className="inline-flex items-center px-8 py-3 text-white bg-green-500 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-600 transition-all transform hover:-translate-y-1"
    >
      Create New Order
    </Link>
  </div>
);

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
      {/* Card Header with Status */}
      <div className="p-5 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-gray-100">
          {order.uniqueId || "Quick-Order"}
        </span>
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          order.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {order.status === 'complete' && <FaCheckCircle />} {order.status || 'Processing'}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {/* Design Info */}
        <div className="flex gap-4 mb-6">
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors">
              {order.designName || "Unnamed Design"}
            </h3>
            <p className="text-xs text-gray-400 font-medium">Completed on {formatDate(order.updatedAt || order.createdAt)}</p>
            <p className="text-lg font-black text-green-600 mt-1">
              ${Number(order.price || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 mb-6">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Stitches</p>
            <p className="text-xs font-bold text-gray-700">{order.stitching_count || "N/A"}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Format</p>
            <p className="text-xs font-bold text-gray-700 truncate">{order.formatRequired || "N/A"}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Fabric</p>
            <p className="text-xs font-bold text-gray-700 truncate">{order.fabric || "N/A"}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Size</p>
            <p className="text-xs font-bold text-gray-700">
              {order.width || 0}×{order.height || 0} <span className="text-[8px] text-gray-400 uppercase">{order.measurement || "in"}</span>
            </p>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold">
                <FaClock className="text-gray-300" />
                {order.paymentStatus || 'Paid'}
            </div>
            <button 
                onClick={() => navigate(`/order/${order._id}`)}
                className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
            >
                View Details <FaEye />
            </button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;