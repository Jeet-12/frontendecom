import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getCompletedAndPaidOrders } from "../../Services/Api";
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

const PaidOrders = () => {
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
        const userIsAdmin = userData?.role?.toLowerCase() === "admin";

        if (userData) {
            setUser(userData);
            setIsAdmin(userIsAdmin);
        }

        const fetchOrders = async () => {
            try {
                let data;
                if (userIsAdmin) {
                    const response = await fetch("http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/order/paid", {
                        method: "GET",
                        headers: {
                            "x-auth-token": token,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to fetch paid orders: ${response.statusText}`);
                    }
                    data = await response.json();
                } else {
                    data = await getCompletedAndPaidOrders(token);
                }
                console.log("Paid Orders data:", data);

                let sortedData = [];
                if (Array.isArray(data)) {
                    // Sort by creation date (newest first)
                    sortedData = data.sort((a, b) =>
                        new Date(b.createdAt) - new Date(a.createdAt)
                    );
                } else if (data?.message) {
                    console.log("Info:", data.message);
                    sortedData = [];
                }

                setOrders(sortedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: `Failed to fetch paid orders: ${err.message}`,
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

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white shadow-sm rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                {isAdmin ? "Paid Order Management" : "My Paid Orders"}
                            </h1>
                            <p className="text-gray-500 mt-2 text-lg">
                                {isAdmin ? `Managing all paid orders` : `Welcome back, ${getUserDisplayName()}! Track your paid orders`}
                            </p>
                            {isAdmin && (
                                <div className="mt-3 flex items-center gap-4 text-sm font-medium text-gray-600">
                                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100 italic">
                                        Total: {orders.length}
                                    </span>
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 italic">
                                        Filtered: {filteredOrders.length}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Search Section */}
                            <div className="relative flex-grow max-w-md shadow-sm rounded-xl overflow-hidden border border-gray-200">
                                {isAdmin ? (
                                    <div className="flex">
                                        <select
                                            value={searchType}
                                            onChange={(e) => setSearchType(e.target.value)}
                                            className="border-r border-gray-200 focus:outline-none bg-gray-50 text-gray-700 px-4 py-2 text-sm font-medium"
                                            style={{ height: "3rem" }}
                                        >
                                            {searchOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="relative flex-grow">
                                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder={
                                                    searchType === "id" ? "Search by Order ID" :
                                                        searchType === "status" ? "Search by status..." :
                                                            `Search by ${searchType}...`
                                                }
                                                className="w-full pl-11 pr-4 py-3 focus:outline-none transition-all text-sm"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search your orders..."
                                            className="w-full pl-11 pr-4 py-3 focus:outline-none transition-all text-sm"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
                            <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-t-4 border-b-4 border-green-200 opacity-20"></div>
                        </div>
                        <span className="mt-6 text-gray-500 font-medium text-lg">Fetching your orders...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center shadow-sm">
                        <FaTimesCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h3>
                        <p className="text-red-600 mb-8 max-w-md mx-auto">{error}</p>
                        <Button
                            label="Try Again"
                            icon="pi pi-refresh"
                            className="p-button p-button-danger px-8 py-3 rounded-xl font-bold"
                            onClick={() => window.location.reload()}
                        />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
                        <div className="mb-8 relative flex justify-center">
                            <div className="bg-gray-50 rounded-full p-8">
                                <img
                                    src={emptyStateImage}
                                    alt="No orders"
                                    className="w-48 h-48 object-contain mix-blend-multiply opacity-80"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
                                    }}
                                />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {searchQuery || status ? "No matching orders found" : "No paid orders yet"}
                        </h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
                            {searchQuery || status ? "Try adjusting your filters or search query." : "When you complete an order and make a payment, it will appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* Order Thumbnail/Preview */}
                                <div className="w-full md:w-64 bg-gray-50 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 min-h-[200px] flex items-center justify-center border-r border-gray-100">
                                    {order.previewImage ? (
                                        <img
                                            src={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${order.previewImage}`}
                                            alt={order.designName}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/400x400?text=No+Preview";
                                            }}
                                        />
                                    ) : (
                                        <div className="text-gray-300 flex flex-col items-center">
                                            <FaSearch className="text-4xl mb-2 opacity-20" />
                                            <span className="text-xs font-semibold uppercase tracking-wider">No Preview Available</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur shadow-sm text-[10px] font-bold px-2 py-1 rounded-lg text-gray-700 uppercase tracking-widest border border-gray-100">
                                            {order.uniqueId || "Quick-Order"}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                            <div className="flex-1 min-w-[200px]">
                                                <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-green-600 transition-colors">
                                                    {order.designName || "Unnamed Design"}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-medium text-gray-400">Ordered by</span>
                                                    <span className="text-sm font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                                        {order.user?.firstname} {order.user?.lastname || ""}
                                                    </span>
                                                    {order.user?.email && (
                                                        <span className="text-xs text-gray-400 italic">({order.user.email})</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                {getStatusBadge(order.status)}
                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-green-600">
                                                        ${order.price ? parseFloat(order.price).toFixed(2) : "0.00"}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Paid via {order.paymentStatus === 'Paid' ? 'PayPal' : 'System'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 py-6 border-y border-gray-50">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fabric Details</p>
                                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                                    {order.fabric || "N/A"}
                                                    <span className="block text-xs font-medium text-gray-500 italic mt-0.5">{order.fabricType || "Standard Type"}</span>
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Specifications</p>
                                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                                    {order.height || 0} x {order.width || 0} <span className="text-gray-400 font-medium">{order.measurement || order.unit || "in"}</span>
                                                    <span className="block text-xs font-medium text-gray-500 mt-0.5">Format: {order.formatRequired || "N/A"}</span>
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stitch Data</p>
                                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                                    {order.stitching_count || "N/A"} <span className="text-gray-400 font-medium">Stitches</span>
                                                    <span className="block text-xs font-medium text-gray-500 mt-0.5">Range: {order.stitchRange || "N/A"}</span>
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Color Setup</p>
                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                    {order.colors?.filter(c => c && c.trim() !== "").length > 0 ? (
                                                        order.colors.filter(c => c && c.trim() !== "").map((color, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-600 border border-gray-200"
                                                            >
                                                                {color}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic font-medium">As Per Design</span>
                                                    )}
                                                    <span className="block w-full text-[10px] font-medium text-gray-400 mt-0.5">{order.noOfColors || 0} Colors Total</span>
                                                </div>
                                            </div>
                                        </div>

                                        {(order.additionalInformation || order.comment) && (
                                            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Additional Information</p>
                                                <p className="text-sm text-gray-600 leading-relaxed italic">
                                                    "{(order.additionalInformation || order.comment || "").substring(0, 150)}..."
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                                <FaClock className="text-gray-300" />
                                                Ordered: {formatDateTime(order.createdAt)}
                                            </div>
                                            {order.timeToComplete && (
                                                <div className="flex items-center gap-2 text-xs text-green-600 font-bold">
                                                    <FaTruck className="text-green-500" />
                                                    Completion Goal: {formatDate(order.timeToComplete)}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            {order.digitalImage && (
                                                <a 
                                                    href={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${order.digitalImage}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-black transition-colors shadow-lg shadow-gray-200"
                                                >
                                                    Download Files
                                                </a>
                                            )}
                                            <Button
                                                label="View Details"
                                                icon={<FaEye className="mr-2" />}
                                                className="flex-1 sm:flex-none p-button p-button-success px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-100"
                                                style={{
                                                    backgroundColor: "rgb(147, 197, 114)",
                                                    borderColor: "rgb(147, 197, 114)"
                                                }}
                                                onClick={() => handleView(order)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination or Footer */}
                <div className="mt-12 py-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm font-medium text-gray-400">
                        Showing <span className="text-gray-900">{filteredOrders.length}</span> of <span className="text-gray-900">{orders.length}</span> paid orders
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Sync Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaidOrders;
