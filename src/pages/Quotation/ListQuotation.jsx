import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { deleteQuotation, getQuotations } from "../../Services/Api";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FaSearch, FaEye, FaTrash, FaPlus, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaClock, FaShoppingCart } from "react-icons/fa";
import { Badge } from "primereact/badge";

const ListQuotation = () => {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("designName");
    const [convertingId, setConvertingId] = useState(null);
    const toast = useRef(null);
    const token = localStorage.getItem("token");
    const [isAdmin, setISAdmin] = useState('user');

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
        setISAdmin(user.role);
        const fetchQuotations = async () => {
            try {
                const data = await getQuotations(token);
                // console.log(data);

                const sortedData = data.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setQuotations(sortedData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (token) {
            fetchQuotations();
        } else {
            setLoading(false);
            setError("Authentication required");
            toast.current.show({
                severity: "error",
                summary: "Authentication Error",
                detail: "Please login to access quotations",
                life: 3000
            });
        }
    }, [token]);

    const handleView = (quotation) => {
        navigate(isAdmin == "admin" ? `/admin/quotation/${quotation._id}` : `/quotation/${quotation._id}`);
    };

    const handleDelete = (quotation) => {
        confirmDialog({
            message: `Are you sure you want to delete "${quotation.designName}"?`,
            header: "Delete Confirmation",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger custom-accept-btn",
            rejectClassName: "p-button-text custom-reject-btn",
            accept: () => performDelete(quotation),
        });
    };

    const performDelete = async (quotation) => {
        try {
            await deleteQuotation(quotation._id, token);
            setQuotations(prev => prev.filter(q => q._id !== quotation._id));
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Quotation deleted successfully",
                life: 3000
            });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.message || "Failed to delete quotation",
                life: 3000
            });
        }
    };

    const convertToOrder = async (quotation) => {
        if (!quotation) return;

        setConvertingId(quotation._id);
        try {
            const userData = JSON.parse(localStorage.getItem("user"));

            const formatDateToMMDDYYYY = (dateString) => {
                const date = new Date(dateString);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            };

            // Create raw multipart form data
            const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
            let body = '';

            const fields = {
                user: userData.id,
                designName: quotation.designName?.trim() || "jeet",
                fabricType: quotation.fabricType || "Soft",
                fabric: quotation.fabric?.trim() || "Febric1",
                noOfColors: String(Number(quotation.noOfColors) || 3),
                colors: quotation.colors?.join(',') || "jdbcjbsbjv,dbfisbf",
                measurement: quotation.measurement || "inches",
                width: String(Number(quotation.width) || 100),
                height: String(Number(quotation.height) || 100),
                stitchRange: quotation.stitchRange?.toString() || "7000-10000",
                formatRequired: quotation.formatRequired || "Pfaff *.KSM",
                timeToComplete: formatDateToMMDDYYYY(quotation.timeToComplete) || "11/04/2025",
                additionalInformation: quotation.additionalInformation?.trim() || "dcjbsjvbdfviudfvu",
                price:quotation.price || 0,
                status: "inprogress",
                files: "" 
            };


            // Build multipart body
            Object.entries(fields).forEach(([key, value]) => {
                body += `--${boundary}\r\n`;
                body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
                body += `${value}\r\n`;
            });

            body += `--${boundary}--\r\n`;

            const API_BASE_URL = "http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api";
            // const API_BASE_URL = "http://localhost:8000/api";

            const response = await fetch(`${API_BASE_URL}/order/create`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token,
                    'Content-Type': `multipart/form-data; boundary=${boundary}`
                },
                body: body
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            toast.current.show({
                severity: "success",
                summary: "Order Created",
                detail: result.message || "Order created successfully!",
                life: 3000,
            });

            navigate("/order");

        } catch (err) {
            console.error("Error converting quotation to order:", err);
            toast.current.show({
                severity: "error",
                summary: "Conversion Failed",
                detail: err.message || "Failed to convert quotation to order",
                life: 3000,
            });
        } finally {
            setConvertingId(null);
        }
    };

    // Enhanced status badge component with icons
    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: {
                label: "Approved",
                severity: "success",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-green-100 text-green-800 border-green-200",
                iconColor: "text-green-500"
            },
            declined: {
                label: "Rejected",
                severity: "danger",
                icon: <FaTimesCircle className="mr-1" />,
                color: "bg-red-100 text-red-800 border-red-200",
                iconColor: "text-red-500"
            },
            pending: {
                label: "Pending",
                severity: "warning",
                icon: <FaClock className="mr-1" />,
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                iconColor: "text-yellow-500"
            },
            completed: {
                label: "Completed",
                severity: "info",
                icon: <FaCheckCircle className="mr-1" />,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                iconColor: "text-blue-500"
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
        switch (status) {
            case 'approved':
                return <Badge value="Approved" severity="success" className="ml-2" />;
            case 'declined':
                return <Badge value="Rejected" severity="danger" className="ml-2" />;
            case 'completed':
                return <Badge value="Completed" severity="info" className="ml-2" />;
            default:
                return <Badge value="Pending" severity="warning" className="ml-2" />;
        }
    };

    const filteredQuotations = quotations.filter(quotation => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        switch (searchType) {
            case "id":
                return quotation.uniqueId?.toLowerCase().includes(query);
            case "firstname":
                return quotation.user?.firstname?.toLowerCase().includes(query);
            case "lastname":
                return quotation.user?.lastname?.toLowerCase().includes(query);
            case "status":
                return quotation.status?.toLowerCase().includes(query);
            case "designName":
            default:
                return quotation.designName.toLowerCase().includes(query);
        }
    });

    // Add search by status option for admin
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
                            {isAdmin == "admin" ? "Quotation Management" : "My Quotations"}
                        </h1>
                        <p className="text-gray-600">
                            {isAdmin == "admin" ? "Manage all customer quotations" : "Track your quotation requests"}
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
                                            searchType === "id" ? "Search by Quotation ID" :
                                                searchType === "status" ? "Search by status (pending, approved, declined)" :
                                                    `Search by ${searchType.replace(/^\w/, c => c.toUpperCase())}...`
                                        }
                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                label="New Quotation"
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
                                    placeholder="Search quotations..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                label="New Quotation"
                                icon={<FaPlus className="mr-2" />}
                                className="p-button p-button-success"
                                style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none", height: "2.7rem" }}
                                onClick={() => navigate("form")}
                            />
                        </div>
                    )}
                </div>

                {/* Content Section */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : filteredQuotations.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <img
                            src={emptyStateImage}
                            alt="No quotations"
                            className="w-48 h-48 mx-auto mb-6"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
                            }}
                        />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Quotations Found
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {isAdmin === "admin" ? "There are no quotations in the system yet." : "You haven't created any quotations yet. Start by creating a new one!"}
                        </p>
                        <Button
                            label="Create Quotation"
                            icon={<FaPlus className="mr-2" />}
                            className="p-button p-button-success"
                            style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none" }}
                            onClick={() => navigate("form")}
                        />
                    </div>
                ) : isAdmin == "admin" ? (
                    <div className="space-y-4">
                        {filteredQuotations.map((quotation) => (
                            <div
                                key={quotation._id}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                                        {/* Left Section */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                                        {quotation.designName}
                                                    </h3>
                                                    {/* <div className="flex items-center">
                                                        {getStatusBadge(quotation.status)}
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Customer</p>
                                                    <p className="font-medium">
                                                        {quotation.user?.firstname + " " + quotation.user?.lastname || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Fabric</p>
                                                    <p className="font-medium">
                                                        {quotation.fabric} ({quotation.fabricType})
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Colors</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {quotation.colors.map((color, i) => (
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
                                                    <p className="text-sm text-gray-500">Price</p>
                                                    <p className="font-medium text-green-600">
                                                        {quotation.price ? `$${quotation.price}` : "N/A"}
                                                    </p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-sm text-gray-500">Comment</p>
                                                    <p className="text-sm text-gray-700">
                                                        {quotation.comment || "No comments"}
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
                                                onClick={() => handleView(quotation)}
                                            />
                                            <Button
                                                label="Delete"
                                                icon={<FaTrash className="mr-2" />}
                                                className="p-button p-button-outlined p-button-danger"
                                                style={{ backgroundColor: "#D40000", borderStyle: "none" }}
                                                onClick={() => handleDelete(quotation)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-1">
                                        ID: {quotation.uniqueId ?? quotation._id}
                                    </p>
                                    <p className="text-base font-semibold text-gray-800">
                                        Created: {formatDate(quotation.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredQuotations.map((quotation) => (
                            <div
                                key={quotation._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 p-6"
                            >
                                <div className="mb-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {quotation.designName}
                                        </h3>
                                        {/* <div className="flex items-center">
                                            {getStatusBadge(quotation.status)}
                                        </div> */}
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Quotation ID:</strong> {quotation._id}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Fabric:</strong> {quotation.fabric}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Fabric Type:</strong> {quotation.fabricType}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Colors:</strong>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {quotation.colors.map((color, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 text-xs rounded-full bg-gray-100"
                                                    >
                                                        {color}
                                                    </span>
                                                ))}
                                            </div>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Dimensions:</strong> {quotation.height} x {quotation.width}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Price:</strong>
                                            <span className="text-green-600 font-semibold ml-1">
                                                {quotation.price ? `$${quotation.price}` : "N/A"}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong className="text-gray-700">Comment:</strong> {quotation.comment || "N/A"}
                                        </p>

                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-sm text-gray-500">
                                                Created: {formatDate(quotation.createdAt)}
                                            </p>
                                            {quotation.statusUpdatedAt && (
                                                <p className="text-sm text-gray-500">
                                                    Status Updated: {formatDate(quotation.statusUpdatedAt)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 mt-4">
                                    <div className="flex justify-between gap-2">
                                        <Button
                                            label="View Details"
                                            icon={<FaEye className="mr-2" />}
                                            className="p-button p-button-outlined flex-1"
                                            style={{ backgroundColor: "rgb(147, 197, 114)", borderStyle: "none" }}
                                            onClick={() => handleView(quotation)}
                                        />
                                        {isAdmin == "admin" && (
                                            <Button
                                                label="Delete"
                                                icon={<FaTrash className="mr-2" />}
                                                className="p-button p-button-outlined p-button-danger flex-1"
                                                style={{ backgroundColor: "#D40000", borderStyle: "none" }}
                                                onClick={() => handleDelete(quotation)}
                                            />
                                        )}
                                    </div>
                                    {status === "complete" && (
                                       
                                    <Button
                                        label={convertingId === quotation._id ? "Converting..." : "Convert to Order"}
                                        icon={convertingId === quotation._id ? "pi pi-spin pi-spinner" : <FaShoppingCart className="mr-2" />}
                                        className="p-button w-full"
                                        style={{ backgroundColor: "#F59E0B", border: "none" }}
                                        onClick={() => convertToOrder(quotation)}
                                        disabled={convertingId !== null}
                                    />
                                    ) }
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListQuotation;