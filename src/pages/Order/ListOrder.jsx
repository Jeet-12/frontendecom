import React, { useRef, useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from "../../Services/Api";
import { FaSearch } from "react-icons/fa";
import { useLocation } from 'react-router-dom';

const ListOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const toast = useRef(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { status } = location.state || {};

  // Using a placeholder image from a free service
  const noDataImage = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(token);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("No Orders Found.");
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No Orders Found.",
          life: 3000,
        });
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setError("User is not authenticated.");
      toast.current.show({
        severity: "error",
        summary: "Authentication Error",
        detail: "User is not authenticated.",
        life: 3000,
      });
    }
  }, [token]);

  const handleView = (order) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") {
      navigate(`/admin/order/${order._id}`);
    } else if (user?.role === "user") {
      navigate(`/order/${order._id}`);
    } else {
      navigate(`/`);
    }
  };

  const handleDelete = (order) => {
    confirmDialog({
      message: `Are you sure you want to delete order "${order.designName}"?`,
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => performDelete(order),
    });
  };

  const performDelete = async (order) => {
    try {
      await deleteOrder(order._id, token);
      setOrders((prevOrders) =>
        prevOrders.filter((o) => o._id !== order._id)
      );
      toast.current.show({
        severity: "success",
        summary: "Deleted",
        detail: "Order deleted successfully.",
        life: 3000,
      });
    } catch (err) {
      setError("Failed to delete the order.");
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete the order.",
        life: 3000,
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = status ? order.status?.toLowerCase() === status.toLowerCase() : true;
    return matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-6">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 md:mb-0">
            🛍️ {status ? `${status} Orders` : "Orders"}
          </h1>
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded-lg p-2 pl-10 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(147,197,114)] transition duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg text-gray-500 animate-pulse">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <span className="text-lg text-red-500">{error}</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img 
              src={noDataImage} 
              alt="No orders found" 
              className="w-64 h-64 object-contain mb-6"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
              }}
            />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              {status 
                ? `There are currently no ${status.toLowerCase()} orders.`
                : "No orders have been created yet."}
            </p>
            <Button
              label="Create New Order"
              icon="pi pi-plus"
              className="p-button-raised p-button-success"
              style={{ backgroundColor: "rgb(147, 197, 114)",borderStyle:"none" }}
              onClick={() => navigate("/order/form")}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 p-6"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {order.designName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Fabric:</strong> {order.fabric}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Fabric Type:</strong> {order.fabricType}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Colors:</strong> {order.colors.join(", ")}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Dimensions:</strong> {order.height} x {order.width} cm
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total Price:</strong>{" "}
                    <span className="text-green-500 font-semibold">
                      ${order.totalPrice}
                    </span>
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <Button
                    label="View"
                    icon="pi pi-eye"
                    className="p-button-raised p-button-success"
                    style={{ backgroundColor: "rgb(147, 197, 114)",borderStyle:"none"  }}
                    onClick={() => handleView(order)}
                  />
                  <Button
                    icon="pi pi-trash"
                    style={{ backgroundColor: "#D40000" ,borderStyle:"none" }}
                    onClick={() => handleDelete(order)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOrder;