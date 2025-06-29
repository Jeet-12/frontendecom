import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { deleteQuotation, getQuotations } from "../../Services/Api";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FaSearch } from "react-icons/fa";

const ListQuotation = () => {
    const navigate = useNavigate();
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const toast = useRef(null);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === 'admin';

    const emptyStateImage = "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-616.jpg";

    useEffect(() => {
        const fetchQuotations = async () => {
            try {
                const data = await getQuotations(token);
                setQuotations(data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
                toast.current.show({ severity: "error", summary: "Error", detail: err, life: 3000 });
            }
        };

        if (token) {
            fetchQuotations();
        } else {
            setLoading(false);
            setError("User is not authenticated.");
            toast.current.show({ severity: "error", summary: "Authentication Error", detail: "User is not authenticated.", life: 3000 });
        }
    }, [token]);

    const handleView = (quotation) => {
        const route = isAdmin ? `/admin/quotation/${quotation._id}` : `/quotation/${quotation._id}`;
        navigate(route);
    };

    const handleDelete = (quotation) => {
        confirmDialog({
            message: `Are you sure you want to delete quotation "${quotation.designName}"?`,
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => performDelete(quotation),
            acceptClassName: "p-button", 
            rejectClassName: "p-button-text", 
        });
    };

    const performDelete = async (quotation) => {
        try {
            await deleteQuotation(quotation._id, token);
            setQuotations(prev => prev.filter(q => q._id !== quotation._id));
            toast.current.show({ severity: "success", summary: "Deleted", detail: "Quotation deleted successfully.", life: 3000 });
        } catch (err) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Failed to delete the quotation.", life: 3000 });
        }
    };

    const renderColors = (colors) => colors.join(", ");

    const filteredQuotations = quotations.filter(quotation =>
        quotation.designName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`min-h-screen p-6 ${isAdmin ? "bg-gray-100" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <h1 className={`text-4xl font-extrabold mb-4 md:mb-0 ${isAdmin ? "text-gray-900" : "text-gray-800"}`}>
                        {isAdmin ? "📋 All Quotations" : "📋 Your Quotations"}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative w-full md:w-64">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by design..."
                                className="border border-gray-300 rounded-lg p-2 pl-10 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(147,197,114)] transition duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            label="Add Quote"
                            icon="pi pi-plus"
                            className="p-button-raised p-button-success"
                            style={{ backgroundColor: "#93C572", borderStyle: "none" }}
                            onClick={() => navigate("form")}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-lg text-gray-500 animate-pulse">Loading quotations...</span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-lg text-red-500">{error}</span>
                    </div>
                ) : filteredQuotations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <img
                            src={emptyStateImage}
                            alt="No quotations"
                            className="w-64 h-64 mb-6 object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://cdn-icons-png.flaticon.com/512/4076/4076478.png";
                            }}
                        />
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                            No Quotations Found
                        </h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            {isAdmin ? "There are no quotations in the system." : "You haven't created any quotations yet."}
                        </p>
                        <Button
                            label="Create Quotation"
                            icon="pi pi-plus"
                            className="p-button-raised p-button-success"
                            style={{ backgroundColor: "#93C572", borderStyle: "none" }}
                            onClick={() => navigate("form")}
                        />
                    </div>
                ) : isAdmin ? (
                    // ADMIN VIEW - Full width detailed cards
                    <div className="space-y-6">
                        {filteredQuotations.map((quotation) => (
                            <div 
                                key={quotation._id} 
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6 border-l-4 border-[#93C572]"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">{quotation.designName}</h3>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>ID:</strong> {quotation._id}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Created By:</strong> {quotation.createdBy?.name || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Status:</strong> 
                                            <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                                                quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {quotation.status || 'pending'}
                                            </span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Fabric:</strong> {quotation.fabric}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Fabric Type:</strong> {quotation.fabricType}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <strong>Colors:</strong> {renderColors(quotation.colors)}
                                        </p>
                                    </div>
                                    <div className="flex items-end justify-end space-x-4">
                                        <Button
                                            label="View Details"
                                            icon="pi pi-eye"
                                            className="p-button-raised p-button-success"
                                            style={{ backgroundColor: "#93C572", borderStyle: "none" }}
                                            onClick={() => handleView(quotation)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-raised p-button-danger"
                                            style={{ backgroundColor: "#D40000", borderStyle: "none" }}
                                            onClick={() => handleDelete(quotation)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // USER VIEW - Grid layout
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredQuotations.map((quotation) => (
                            <div
                                key={quotation._id}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 p-6"
                            >
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{quotation.designName}</h3>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">
                                        <strong>Fabric:</strong> {quotation.fabric}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Type:</strong> {quotation.fabricType}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Colors:</strong> {renderColors(quotation.colors)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Quantity:</strong> {quotation.quantity ?? 0}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Status:</strong> 
                                        <span className={`px-2 py-1 rounded-full text-xs ml-2 ${
                                            quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {quotation.status || 'pending'}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <Button
                                        label="View"
                                        icon="pi pi-eye"
                                        className="p-button-raised p-button-success"
                                        style={{ backgroundColor: "#93C572", borderStyle: "none" }}
                                        onClick={() => handleView(quotation)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-raised p-button-danger"
                                        style={{ backgroundColor: "#D40000", borderStyle: "none" }}
                                        onClick={() => handleDelete(quotation)}
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

export default ListQuotation;