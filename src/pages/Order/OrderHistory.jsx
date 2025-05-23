import React, { useEffect, useState } from "react";
import { SectionTitle } from "../../components";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Using a working image URL from a free image hosting service
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
          // If the API returns an empty array or specific no orders message
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
        // Handle case where there are no orders (empty array)
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="loader"></span>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-md rounded-lg p-8">
          <SectionTitle title="Order History" path="Home | Order History" />

          {orders.length === 0 ? (
            <NoOrders imageUrl={noOrdersImage} />
          ) : (
            <OrderList orders={orders} />
          )}
        </div>
      </div>
    </div>
  );
};

const NoOrders = ({ imageUrl }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <img 
      src={imageUrl} 
      alt="No orders found" 
      className="w-64 h-64 object-contain mb-6"
      onError={(e) => {
        e.target.onerror = null; 
        e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
      }}
    />
    <h1 className="text-2xl font-semibold text-gray-800 mb-2">
      No Orders Yet
    </h1>
    <p className="text-gray-500 mb-6 text-center max-w-md">
      You haven't placed any orders yet. Start by creating your first order.
    </p>
   <Link
  to="/order/form"
  className="inline-flex items-center px-6 py-3 text-white bg-[#4CAF50] rounded-md shadow hover:bg-[#43A047] transition"
>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 mr-2" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path 
          fillRule="evenodd" 
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" 
          clipRule="evenodd" 
        />
      </svg>
      Create Order
    </Link>
  </div>
);

const OrderList = ({ orders }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {orders.map((order) => (
      <OrderCard key={order.id || nanoid()} order={order} />
    ))}
  </div>
);

const OrderCard = ({ order }) => {
  const calculateTotal = (subtotal) => subtotal + 50 + subtotal * 0.2;

  return (
    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Order #{order._id || "N/A"}
        </h2>
      </div>
      <div className="space-y-4">
        <div key={nanoid()} className="flex items-center space-x-4">
          <img
            src={`${process.env.API_URL}${order.previewImage}`}
            alt={order.designName}
            className="w-12 h-12 object-cover rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/48";
            }}
          />
          <div>
            <p className="text-sm font-medium text-gray-800">{order.designName}</p>
            <p className="text-xs text-gray-500">
              Size: {order.selectedSize}, Qty: {order.amount}
            </p>
            <p className="text-sm text-gray-600">
              ${(order.price * order.amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t pt-4 mt-4 space-y-2">
        <p className="text-sm text-gray-600">Subtotal: ${order.subtotal}</p>
        <p className="text-sm text-gray-600">Shipping: $50</p>
        <p className="text-sm text-gray-600">
          Tax (20%): ${(order.subtotal * 0.2).toFixed(2)}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          Total: ${calculateTotal(order.subtotal).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default OrderHistory;