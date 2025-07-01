import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from "../../Services/Api";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FaSearch, FaEye, FaTrash, FaPlus, FaInfoCircle } from "react-icons/fa";
import { Badge } from "primereact/badge";
import { useLocation } from 'react-router-dom';

const ListOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("designName");
    const toast = useRef(null);
    const token = localStorage.getItem("token");
    const [isAdmin, setIsAdmin] = useState('user');
    const location = useLocation();
    const { status } = location.state || {};

    const emptyStateImage = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg";

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(user.role);
        const fetchOrders = async () => {
            try {
                const data = await getOrders(token);
                setOrders(data);
                setLoading(false);
            } catch (err) {
                setError(err.message || "Failed to fetch orders");
                setLoading(false);
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: err.message || "Failed to fetch orders",
                    life: 3000
                });
            }
        };

        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
            setError("Authentication required");
            toast.current.show({
                severity: "error",
                summary: "Authentication Error",
                detail: "Please login to access orders",
                life: 3000
            });
        }
    }, [token]);

    const handleView = (order) => {
        navigate(isAdmin == "admin" ? `/admin/order/${order._id}` : `/order/${order._id}`);
    };

    const handleDelete = (order) => {
        confirmDialog({
            message: `Are you sure you want to delete "${quotation.designName}"?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger custom-accept-btn",
            rejectClassName: "p-button-text custom-reject-btn",
            accept: () => performDelete(order),
        });
    };

    const performDelete = async (order) => {
        try {
            await deleteOrder(order._id, token);
            setOrders(prev => prev.filter(o => o._id !== order._id));
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Order deleted successfully",
                life: 3000
            });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.message || "Failed to delete order",
                life: 3000
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <Badge value="Completed" severity="success" className="ml-2" style={{ display: "flex", alignItems: "center" }} />;
            case 'cancelled':
                return <Badge value="Cancelled" severity="danger" className="ml-2" style={{ display: "flex", alignItems: "center" }} />;
            case 'shipped':
                return <Badge value="Shipped" severity="info" className="ml-2" style={{ display: "flex", alignItems: "center" }} />;
            default:
                return <Badge value="Processing" severity="warning" className="ml-2" style={{ display: "flex", alignItems: "center" }} />;
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = status ? order.status?.toLowerCase() === status.toLowerCase() : true;
        const query = searchQuery.toLowerCase();

        if (!matchesStatus) return false;

        switch (searchType) {
            case "id":
                return order._id.toLowerCase().includes(query);
            case "firstname":
                return order.user?.firstname?.toLowerCase().includes(query);
            case "lastname":
                return order.user?.lastname?.toLowerCase().includes(query);
            case "designName":
            default:
                return order.designName.toLowerCase().includes(query);
        }
    });

    return (
        <div className={`min-h-screen p-4 md:p-8 ${isAdmin ? "bg-gray-50" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="bg-white shadow-lg rounded-lg p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {isAdmin == "user" ? "Order Management" : "My Orders"}
                        </h1>
                        <p className="text-gray-600">
                            {isAdmin == "admin" ? "Manage all customer orders" : "Track your order requests"}
                        </p>
                    </div>

                    {isAdmin == "admin" ? (
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-grow max-w-md flex">
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value)}
                                    className="border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 text-gray-700 px-3"
                                    style={{ height: "2.7rem" }}
                                >
                                    <option value="designName">Design Name</option>
                                    <option value="id">ID</option>
                                    <option value="firstname">Firstname</option>
                                    <option value="lastname">Surname</option>
                                </select>
                                <div className="relative flex-grow" style={{ display: "flex", height: "2.7rem" }}>
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={`Search by ${searchType}...`}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                label="New Order"
                                icon={<FaPlus className="mr-2" />}
                                className="p-button p-button-success"
                                style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none", height: "2.7rem" }}
                                onClick={() => navigate("form")}
                            />
                        </div>
                    ) : (<div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative flex-grow max-w-md">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            label="New Order"
                            icon={<FaPlus className="mr-2" />}
                            className="p-button p-button-success"
                            style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none", height: "2.7rem" }}
                            onClick={() => navigate("form")}
                        />
                    </div>)}
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-center">
                            <FaInfoCircle className="text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <img
                            src={emptyStateImage}
                            alt="No orders"
                            className="w-48 h-48 mx-auto mb-6"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
                            }}
                        />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Orders Found
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {isAdmin ? "There are no orders in the system yet." : "You haven't created any orders yet. Start by creating a new one!"}
                        </p>
                        <Button
                            label="Create Order"
                            icon={<FaPlus className="mr-2" />}
                            className="p-button p-button-success"
                            style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none" }}
                            onClick={() => navigate("form")}
                        />
                    </div>
                ) : isAdmin == "admin" ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                                        {/* Left Section */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                    {order.designName}
                                                </h3>
                                                {getStatusBadge(order.status)}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Customer</p>
                                                    <p className="font-medium">
                                                        {order.user?.firstname + " " + order.user?.lastname || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Fabric</p>
                                                    <p className="font-medium">
                                                        {order.fabric} ({order.fabricType})
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Colors</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {order.colors.map((color, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 text-xs rounded-full bg-gray-100"
                                                            >
                                                                {color}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Quantity</p>
                                                    <p className="font-medium">
                                                        {order.quantity || "Not specified"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Price</p>
                                                    <p className="font-medium text-green-600">
                                                        ${order.totalPrice?.toFixed(2) || "0.00"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section - Actions */}
                                        <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                                            <Button
                                                label="View Details"
                                                icon={<FaEye className="mr-2" />}
                                                className="p-button p-button-outlined"
                                                style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none" }}
                                                onClick={() => handleView(order)}
                                            />
                                            <Button
                                                label="Delete"
                                                icon={<FaTrash className="mr-2" />}
                                                className="p-button p-button-outlined p-button-danger"
                                                style={{ backgroundColor: "#D40000", borderStyle: "none" }}
                                                onClick={() => handleDelete(order)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        ID: {order._id} • Created: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
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
                                        <strong>Status:</strong>{" "}
                                        <span className="capitalize">{order.status}</span>
                                    </p>
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
                                        <strong>Dimensions:</strong> {order.height} x {order.width} inches
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Total Price:</strong>{" "}
                                        <span className="text-green-500 font-semibold">
                                            ${order.totalPrice?.toFixed(2) || "0.00"}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <Button
                                        label="View Details"
                                        icon={<FaEye className="mr-2" />}
                                        className="p-button p-button-outlined"
                                        style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none" }}
                                        onClick={() => handleView(order)}
                                    />
                                    <Button
                                        label="Delete"
                                        icon={<FaTrash className="mr-2" />}
                                        className="p-button p-button-outlined p-button-danger"
                                        style={{ backgroundColor: "#D40000", borderStyle: "none" }}
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