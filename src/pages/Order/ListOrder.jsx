import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from "../../Services/Api";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FaSearch, FaEye, FaTrash, FaPlus, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaClock, FaTruck, FaCogs } from "react-icons/fa";
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

    // Function to format date as dd/mm/yy
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setIsAdmin(user.role);
        const fetchOrders = async () => {
            try {
                const data = await getOrders(token);
                console.log(data);
                
                const sortedData = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setOrders(sortedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
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
            message: `Are you sure you want to delete "${order.designName}"?`,
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

    // Enhanced status badge component with icons and colors
    const getStatusBadge = (status) => {
        const statusConfig = {
            complete: {
                label: "Completed",
                severity: "success",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-green-100 text-green-800 border-green-200",
                iconColor: "text-green-500",
                primeSeverity: "success"
            },
            pending: {
                label: "Pending",
                severity: "danger",
                icon: <FaClock className="mr-1" />,
                color: "bg-red-100 text-red-800 border-red-200",
                iconColor: "text-red-500",
                primeSeverity: "danger"
            },
            processing: {
                label: "Processing",
                severity: "warning",
                icon: <FaCogs className="mr-1" />,
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                iconColor: "text-yellow-500",
                primeSeverity: "warning"
            },
            shipped: {
                label: "Shipped",
                severity: "info",
                icon: <FaTruck className="mr-1" />,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                iconColor: "text-blue-500",
                primeSeverity: "info"
            },
            cancelled: {
                label: "Cancelled",
                severity: "danger",
                icon: <FaTimesCircle className="mr-1" />,
                color: "bg-gray-100 text-gray-800 border-gray-200",
                iconColor: "text-gray-500",
                primeSeverity: "danger"
            },
            delivered: {
                label: "Delivered",
                severity: "success",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-teal-100 text-teal-800 border-teal-200",
                iconColor: "text-teal-500",
                primeSeverity: "success"
            }
        };

        const config = statusConfig[status] || statusConfig.processing;

        // Return custom badge
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
                <span className={config.iconColor}>{config.icon}</span>
                {config.label}
            </span>
        );
    };

    // Alternative: PrimeReact Badge version
    const getPrimeStatusBadge = (status) => {
        const statusConfig = {
            complete: { value: "Completed", severity: "success" },
            pending: { value: "Pending", severity: "danger" },
            processing: { value: "Processing", severity: "warning" },
            shipped: { value: "Shipped", severity: "info" },
            cancelled: { value: "Cancelled", severity: "danger" },
            delivered: { value: "Delivered", severity: "success" }
        };

        const config = statusConfig[status] || statusConfig.processing;
        return <Badge value={config.value} severity={config.severity} className="ml-2" />;
    };

    // Status filter chips for quick filtering
    const StatusFilterChips = () => {
        const statuses = [
            { id: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
            { id: 'complete', label: 'Completed', color: 'bg-green-100 text-green-800' },
            { id: 'pending', label: 'Pending', color: 'bg-red-100 text-red-800' },
            { id: 'processing', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
            { id: 'shipped', label: 'Shipped', color: 'bg-blue-100 text-blue-800' },
            { id: 'delivered', label: 'Delivered', color: 'bg-teal-100 text-teal-800' }
        ];

        return (
            <div className="flex flex-wrap gap-2 mb-6">
                {statuses.map((statusItem) => (
                    <button
                        key={statusItem.id}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${statusItem.color} ${status === statusItem.id ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                        onClick={() => {
                            // Navigate with status filter
                            navigate('.', { state: { status: statusItem.id === 'all' ? null : statusItem.id } });
                            // Force reload or update state
                            window.location.reload();
                        }}
                    >
                        {statusItem.label}
                    </button>
                ))}
            </div>
        );
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = status ? order.status?.toLowerCase() === status.toLowerCase() : true;
        const query = searchQuery.toLowerCase().trim();
        if (!matchesStatus) return false;

        switch (searchType) {
            case "id":
                return order.uniqueId?.toLowerCase().includes(query);
            case "firstname":
                return order.user?.firstname?.toLowerCase().includes(query);
            case "lastname":
                return order.user?.lastname?.toLowerCase().includes(query);
            case "status":
                return order.status?.toLowerCase().includes(query);
            case "designName":
            default:
                return order.designName.toLowerCase().includes(query);
        }
    });

    // Add search by status option
    const searchOptions = [
        { value: "designName", label: "Design Name" },
        { value: "id", label: "ID" },
        { value: "firstname", label: "Firstname" },
        { value: "lastname", label: "Surname" },
        ...(isAdmin === "admin" ? [{ value: "status", label: "Status" }] : [])
    ];

    return (
        <div className={`min-h-screen p-4 md:p-8 ${isAdmin ? "bg-gray-50" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="bg-white shadow-lg rounded-lg p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {isAdmin == "admin" ? "Order Management" : "My Orders"}
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
                                    {searchOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="relative flex-grow" style={{ display: "flex", height: "2.7rem" }}>
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder={
                                            searchType === "id" ? "Search by Order ID" :
                                            searchType === "status" ? "Search by status (complete, pending, etc.)" :
                                            `Search by ${searchType.replace(/^\w/, c => c.toUpperCase())}...`
                                        }
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
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
                        </div>
                    )}
                </div>

                {/* Status Filter Chips */}
                {/* {isAdmin === "admin" && <StatusFilterChips />} */}

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
                            {isAdmin === "admin" ? "There are no orders in the system yet." : "You haven't created any orders yet. Start by creating a new one!"}
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
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    {order.designName}
                                                </h3>
                                                <div className="flex items-center">
                                                    {getStatusBadge(order.status)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Customer</p>
                                                    <p className="font-medium">
                                                        {order.user?.firstname + " " + order.user?.lastname || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Fabric Details</p>
                                                    <p className="font-medium">
                                                        {order.fabric} ({order.fabricType})
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Status</p>
                                                    <div className="mt-1">
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Colors</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {order.colors?.map((color, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 text-xs rounded-full bg-gray-100"
                                                            >
                                                                {color}
                                                            </span>
                                                        )) || "N/A"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Dimensions</p>
                                                    <p className="font-medium">
                                                        {order.height} x {order.width} 
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Price</p>
                                                    <p className="font-medium text-green-600 text-lg">
                                                        ${order.price || order.totalPrice || "0.00"}
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
                                    <p className="text-xs text-gray-500 mb-1">
                                        ID: {order.uniqueId ?? order._id}
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        Created: {formatDate(order.createdAt)}
                                        {order.updatedAt && order.updatedAt !== order.createdAt && (
                                            <span className="text-sm text-gray-600 ml-4">
                                                | Updated: {formatDate(order.updatedAt)}
                                            </span>
                                        )}
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
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {order.designName}
                                        </h3>
                                        <div className="flex items-center">
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Order ID:</strong> {order._id}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Fabric:</strong> {order.fabric}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Fabric Type:</strong> {order.fabricType}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Colors:</strong> 
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {order.colors?.map((color, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 text-xs rounded-full bg-gray-100"
                                                    >
                                                        {color}
                                                    </span>
                                                )) || "N/A"}
                                            </div>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Dimensions:</strong> {order.height} x {order.width}  
                                        </p>
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Created: {formatDate(order.createdAt)}
                                            </p>
                                            {order.updatedAt && order.updatedAt !== order.createdAt && (
                                                <p className="text-sm text-gray-500">
                                                    Updated: {formatDate(order.updatedAt)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-lg font-bold text-green-600">
                                                Total: ${order.totalPrice || order.price || "0.00"}
                                            </p>
                                        </div>
                                    </div>
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