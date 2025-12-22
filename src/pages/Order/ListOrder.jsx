import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from "../../Services/Api";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FaSearch, FaEye, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaClock, FaTruck, FaCogs, FaEdit } from "react-icons/fa";
import { Badge } from "primereact/badge";
import { useLocation } from 'react-router-dom';

// Utility function to get user from localStorage
const getUserFromStorage = () => {
    try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        return null;
    }
};

const ListOrder = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("designName");
    const toast = useRef(null);
    const token = localStorage.getItem("token");
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();
    const { status } = location.state || {};

    const emptyStateImage = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg";

    // Function to format date as dd/mm/yy
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        return `${day}/${month}/${year}`;
    };

    // Function to format date with time
    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    useEffect(() => {
        // Get user from localStorage
        const userData = getUserFromStorage();
        if (userData) {
            setUser(userData);
            setIsAdmin(userData.role === "admin");
        }

        const fetchOrders = async () => {
            try {
                const data = await getOrders(token);
                console.log("Orders data:", data);
                
                // Sort by creation date (newest first)
                const sortedData = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setOrders(sortedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: `Failed to fetch orders: ${err.message}`,
                    life: 3000
                });
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
            setError("Authentication required");
            toast.current?.show({
                severity: "error",
                summary: "Authentication Error",
                detail: "Please login to access orders",
                life: 3000
            });
            // Redirect to login if no token
            navigate("/login");
        }
    }, [token, navigate]);

    const handleView = (order) => {
        navigate(isAdmin ? `/admin/order/${order._id}` : `/order/${order._id}`);
    };

    const handleEdit = (order) => {
        navigate(`/order/edit/${order._id}`);
    };

    const handleDelete = (order) => {
        confirmDialog({
            message: `Are you sure you want to delete order "${order.designName}"?`,
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
            completed: {
                label: "Completed",
                severity: "success",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-green-100 text-green-800 border-green-200",
                iconColor: "text-green-500",
                primeSeverity: "success"
            },
            pending: {
                label: "Pending",
                severity: "warning",
                icon: <FaClock className="mr-1" />,
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                iconColor: "text-yellow-500",
                primeSeverity: "warning"
            },
            processing: {
                label: "Processing",
                severity: "info",
                icon: <FaCogs className="mr-1" />,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                iconColor: "text-blue-500",
                primeSeverity: "info"
            },
            shipped: {
                label: "Shipped",
                severity: "info",
                icon: <FaTruck className="mr-1" />,
                color: "bg-indigo-100 text-indigo-800 border-indigo-200",
                iconColor: "text-indigo-500",
                primeSeverity: "info"
            },
            cancelled: {
                label: "Cancelled",
                severity: "danger",
                icon: <FaTimesCircle className="mr-1" />,
                color: "bg-red-100 text-red-800 border-red-200",
                iconColor: "text-red-500",
                primeSeverity: "danger"
            },
            delivered: {
                label: "Delivered",
                severity: "success",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-teal-100 text-teal-800 border-teal-200",
                iconColor: "text-teal-500",
                primeSeverity: "success"
            },
            approved: {
                label: "Approved",
                severity: "success",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-emerald-100 text-emerald-800 border-emerald-200",
                iconColor: "text-emerald-500",
                primeSeverity: "success"
            },
            declined: {
                label: "Declined",
                severity: "danger",
                icon: <FaTimesCircle className="mr-1" />,
                color: "bg-rose-100 text-rose-800 border-rose-200",
                iconColor: "text-rose-500",
                primeSeverity: "danger"
            }
        };

        const config = statusConfig[status] || statusConfig.pending;

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
            completed: { value: "Completed", severity: "success" },
            pending: { value: "Pending", severity: "warning" },
            processing: { value: "Processing", severity: "info" },
            shipped: { value: "Shipped", severity: "info" },
            cancelled: { value: "Cancelled", severity: "danger" },
            delivered: { value: "Delivered", severity: "success" },
            approved: { value: "Approved", severity: "success" },
            declined: { value: "Declined", severity: "danger" }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return <Badge value={config.value} severity={config.severity} className="ml-2" />;
    };

    // Status filter chips for quick filtering (admin only)
    const StatusFilterChips = () => {
        const statuses = [
            { id: 'all', label: 'All', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
            { id: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
            { id: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
            { id: 'approved', label: 'Approved', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
            { id: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
            { id: 'delivered', label: 'Delivered', color: 'bg-teal-100 text-teal-800 hover:bg-teal-200' },
            { id: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
            { id: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800 hover:bg-red-200' }
        ];

        return (
            <div className="flex flex-wrap gap-2 mb-6">
                {statuses.map((statusItem) => (
                    <button
                        key={statusItem.id}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${statusItem.color} ${status === statusItem.id ? 'ring-2 ring-offset-2 ring-gray-400 font-bold' : ''}`}
                        onClick={() => {
                            navigate('.', { 
                                state: { status: statusItem.id === 'all' ? null : statusItem.id },
                                replace: true 
                            });
                        }}
                    >
                        {statusItem.label}
                    </button>
                ))}
            </div>
        );
    };

    // Filter orders based on search query and status filter
    const filteredOrders = orders.filter(order => {
        // Apply status filter if active
        if (status && status !== 'all') {
            if (order.status?.toLowerCase() !== status.toLowerCase()) {
                return false;
            }
        }

        // Apply search query
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        switch (searchType) {
            case "id":
                return order.uniqueId?.toLowerCase().includes(query) || 
                       order._id?.toLowerCase().includes(query);
            case "firstname":
                return order.user?.firstname?.toLowerCase().includes(query);
            case "lastname":
                return order.user?.lastname?.toLowerCase().includes(query);
            case "email":
                return order.user?.email?.toLowerCase().includes(query);
            case "status":
                return order.status?.toLowerCase().includes(query);
            case "fabric":
                return order.fabric?.toLowerCase().includes(query);
            case "designName":
            default:
                return order.designName?.toLowerCase().includes(query);
        }
    });

    // Search options based on user role
    const searchOptions = [
        { value: "designName", label: "Design Name" },
        { value: "id", label: "Order ID" },
        ...(isAdmin ? [
            { value: "firstname", label: "First Name" },
            { value: "lastname", label: "Last Name" },
            { value: "email", label: "Email" },
            { value: "status", label: "Status" },
            { value: "fabric", label: "Fabric" }
        ] : [])
    ];

    // Get user display name
    const getUserDisplayName = () => {
        if (!user) return "User";
        return `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email || "User";
    };

    return (
        <div className={`min-h-screen p-4 md:p-8 ${isAdmin ? "bg-gray-50" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}>
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="bg-white shadow-lg rounded-lg p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {isAdmin ? "Order Management" : "My Orders"}
                        </h1>
                        <p className="text-gray-600">
                            {isAdmin ? `Managing all customer orders` : `Welcome back, ${getUserDisplayName()}! Track your order requests`}
                        </p>
                        {isAdmin && (
                            <div className="mt-2 text-sm text-gray-500">
                                Total Orders: {orders.length} | Filtered: {filteredOrders.length}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search Section */}
                        <div className="relative flex-grow max-w-md">
                            {isAdmin ? (
                                <div className="flex">
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 text-gray-700 px-3 py-2"
                                        style={{ height: "2.7rem" }}
                                    >
                                        {searchOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="relative flex-grow">
                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={
                                                searchType === "id" ? "Search by Order ID" :
                                                searchType === "status" ? "Search by status..." :
                                                `Search by ${searchType}...`
                                            }
                                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search your orders..."
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* New Order Button */}
                        <Button
                            label="New Order"
                            icon={<FaPlus className="mr-2" />}
                            className="p-button p-button-success"
                            style={{ 
                                backgroundColor: "rgb(147, 197, 114)", 
                                borderStyle: "none", 
                                height: "2.7rem",
                                minWidth: "140px"
                            }}
                            onClick={() => navigate("form")}
                        />
                    </div>
                </div>

                {/* Status Filter Chips (Admin only) */}
                {isAdmin && <StatusFilterChips />}

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        <span className="ml-4 text-gray-600">Loading orders...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <FaTimesCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Orders</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button
                            label="Retry"
                            icon="pi pi-refresh"
                            className="p-button p-button-outlined p-button-danger"
                            onClick={() => window.location.reload()}
                        />
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
                            {searchQuery || status ? "No Matching Orders Found" : "No Orders Found"}
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {searchQuery || status 
                                ? "Try adjusting your search or filter criteria"
                                : isAdmin 
                                    ? "There are no orders in the system yet." 
                                    : "You haven't created any orders yet. Start by creating a new one!"
                            }
                        </p>
                        <div className="flex justify-center gap-3">
                            {searchQuery && (
                                <Button
                                    label="Clear Search"
                                    className="p-button p-button-outlined"
                                    onClick={() => setSearchQuery("")}
                                />
                            )}
                            <Button
                                label="Create Order"
                                icon={<FaPlus className="mr-2" />}
                                className="p-button p-button-success"
                                style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none" }}
                                onClick={() => navigate("form")}
                            />
                        </div>
                    </div>
                ) : isAdmin ? (
                    // Admin View - List View
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                            >
                                <div className="p-4 md:p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 md:gap-6">
                                        {/* Left Section */}
                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-3 gap-2">
                                                <div>
                                                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                                        {order.designName || "Unnamed Order"}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Order ID: {order.uniqueId || order._id?.substring(0, 8) || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    {getStatusBadge(order.status)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Customer</p>
                                                    <p className="font-medium">
                                                        {order.user?.firstname} {order.user?.lastname}
                                                        {order.user?.email && (
                                                            <span className="block text-sm text-gray-500">{order.user.email}</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Fabric Details</p>
                                                    <p className="font-medium">
                                                        {order.fabric || "N/A"} {order.fabricType && `(${order.fabricType})`}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Status & Timeline</p>
                                                    <div className="mt-1">
                                                        {getStatusBadge(order.status)}
                                                        {order.statusUpdatedAt && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Updated: {formatDate(order.statusUpdatedAt)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Colors</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {order.colors?.length > 0 ? (
                                                            order.colors.map((color, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-1 text-xs rounded-full bg-gray-100"
                                                                >
                                                                    {color}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">No colors specified</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Dimensions</p>
                                                    <p className="font-medium">
                                                        {order.height || "N/A"} x {order.width || "N/A"} 
                                                        {order.unit && <span className="text-sm text-gray-600"> {order.unit}</span>}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Price</p>
                                                    <p className="font-medium text-green-600 text-lg">
                                                        ${order.price ? parseFloat(order.price).toFixed(2) : "0.00"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section - Actions */}
                                        <div className="flex flex-row md:flex-col gap-2 justify-end md:justify-start">
                                            <Button
                                                label="View"
                                                icon={<FaEye className="mr-2" />}
                                                className="p-button p-button-outlined p-button-sm md:p-button"
                                                style={{ 
                                                    backgroundColor: "rgb(147, 197, 114)", 
                                                    borderStyle: "none",
                                                    minWidth: "100px"
                                                }}
                                                onClick={() => handleView(order)}
                                            />
                                            <Button
                                                label="Delete"
                                                icon={<FaTrash className="mr-2" />}
                                                className="p-button p-button-outlined p-button-danger p-button-sm md:p-button"
                                                style={{ 
                                                    backgroundColor: "#D40000", 
                                                    borderStyle: "none",
                                                    minWidth: "100px"
                                                }}
                                                onClick={() => handleDelete(order)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 md:px-6 py-3 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Created: {formatDateTime(order.createdAt)}
                                        </p>
                                        {order.updatedAt && order.updatedAt !== order.createdAt && (
                                            <p className="text-sm text-gray-500">
                                                Last Updated: {formatDateTime(order.updatedAt)}
                                            </p>
                                        )}
                                    </div>
                                    {order.notes && (
                                        <div className="text-sm text-gray-600 max-w-md">
                                            <span className="font-medium">Notes:</span> {order.notes.substring(0, 100)}
                                            {order.notes.length > 100 && "..."}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // User View - Grid Cards
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-[1.02] border border-gray-100 p-5 flex flex-col h-full"
                            >
                                {/* Header with Design Name and Status */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-800 truncate">
                                            {order.designName || "My Order"}
                                        </h3>
                                        <div className="flex-shrink-0">
                                            {getStatusBadge(order.status)}
                                        </div>
                                    </div>
                                    
                                    {/* Order Details */}
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="text-sm font-medium text-gray-700 truncate">
                                                {order._id?.substring(0, 10)}...
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Fabric</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {order.fabric || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Type</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {order.fabricType || "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Colors</p>
                                            <div className="flex flex-wrap gap-1">
                                                {order.colors?.slice(0, 3).map((color, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 text-xs rounded-full bg-gray-100"
                                                    >
                                                        {color}
                                                    </span>
                                                ))}
                                                {order.colors?.length > 3 && (
                                                    <span className="px-2 py-1 text-xs text-gray-500">
                                                        +{order.colors.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Dimensions</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {order.height || "N/A"} x {order.width || "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Total Price</p>
                                                <p className="text-lg font-bold text-green-600">
                                                    ${order.price ? parseFloat(order.price).toFixed(2) : "0.00"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="pt-3 border-t border-gray-100">
                                            <p className="text-sm text-gray-500 mb-1">Timeline</p>
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-600">
                                                    Created: {formatDate(order.createdAt)}
                                                </p>
                                                {order.statusUpdatedAt && (
                                                    <p className="text-xs text-gray-600">
                                                        Status Updated: {formatDate(order.statusUpdatedAt)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {order.notes && (
                                            <div className="pt-2 border-t border-gray-100">
                                                <p className="text-sm text-gray-500 mb-1">Notes</p>
                                                <p className="text-xs text-gray-600 truncate">
                                                    {order.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex justify-between gap-2">
                                        <Button
                                            label="View Details"
                                            icon={<FaEye className="mr-2" />}
                                            className="p-button p-button-outlined flex-1"
                                            style={{ 
                                                backgroundColor: "rgb(147, 197, 114)", 
                                                borderStyle: "none",
                                                fontSize: "0.875rem"
                                            }}
                                            onClick={() => handleView(order)}
                                        />
                                        <Button
                                            label="Edit"
                                            icon={<FaEdit className="mr-2" />}
                                            className="p-button p-button-outlined p-button-secondary flex-1"
                                            style={{ 
                                                backgroundColor: "#6c757d", 
                                                borderStyle: "none",
                                                fontSize: "0.875rem"
                                            }}
                                            onClick={() => handleEdit(order)}
                                        />
                                        <Button
                                            label="Delete"
                                            icon={<FaTrash className="mr-2" />}
                                            className="p-button p-button-outlined p-button-danger flex-1"
                                            style={{ 
                                                backgroundColor: "#D40000", 
                                                borderStyle: "none",
                                                fontSize: "0.875rem"
                                            }}
                                            onClick={() => handleDelete(order)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination or Load More (if needed) */}
                {filteredOrders.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Showing {filteredOrders.length} of {orders.length} orders
                            </p>
                            {filteredOrders.length > 20 && (
                                <Button
                                    label="Load More"
                                    icon="pi pi-chevron-down"
                                    className="p-button p-button-outlined"
                                    onClick={() => {/* Implement load more logic */}}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListOrder;