import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuotationById, approveQuotation, rejectQuotation } from "../../Services/Api";
import { createOrder } from "../../Services/Api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const QuotationDetail = () => {
    const { id } = useParams();
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [converting, setConverting] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const data = await getQuotationById(id, token);
                setQuotation(data);
                console.log("Quotation data:", data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch quotation details.");
                setLoading(false);
            }
        };

        const fetchUserRole = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            setRole(user?.role);
        };

        fetchUserRole();
        fetchQuotation();
    }, [id, token]);

    const handleEdit = (quotation) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === 'admin') {
            navigate(`/admin/quotation/edit/${quotation._id}`, { state: quotation });
        } else if (user?.role === 'user') {
            navigate(`/quotation/edit/${quotation._id}`, { state: quotation });
        } else {
            navigate(`/`);
        }
    };

    // Function to convert quotation to order
    const convertToOrder = async () => {
        if (!quotation) return;

        setConverting(true);
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            
            // Format the date to ISO string (YYYY-MM-DDTHH:mm:ss.sssZ)
            const formatDateToISO = (dateString) => {
                if (!dateString) return new Date().toISOString();
                
                const date = new Date(dateString);
                // If it's already a valid date, return as ISO string
                if (!isNaN(date.getTime())) {
                    return date.toISOString();
                }
                
                // If parsing fails, use current date
                console.warn("Invalid date provided, using current date");
                return new Date().toISOString();
            };

            // Prepare order data from quotation - match the exact order format
            const orderData = {
                user: userData.id || quotation.user,
                designName: quotation.designName?.trim() || "Untitled Design",
                fabricType: quotation.fabricType || "",
                fabric: quotation.fabric?.trim() || "",
                noOfColors: Number(quotation.noOfColors) || 0,
                colors: quotation.colors || [],
                width: Number(quotation.width) || 0,
                height: Number(quotation.height) || 0,
                stitchRange: quotation.stitchRange?.toString() || "",
                formatRequired: quotation.formatRequired || "",
                timeToComplete: formatDateToISO(quotation.timeToComplete),
                additionalInformation: quotation.additionalInformation?.trim() || "",
                totalPrice: Number(quotation.price) || 0,
                status: "pending", // Using "pending" instead of "inprogress" to match your order format
                paymentStatus: "Pending", // Added paymentStatus field
                files: quotation.files || []
            };

            console.log("Creating order with data:", orderData);

            const result = await createOrder(orderData, token);
            console.log("Order creation result:", result);
            
            toast.current.show({
                severity: "success",
                summary: "Order Created",
                detail: result.message || "Order created successfully!",
                life: 3000,
            });
            
            // Navigate to orders page after successful creation
            setTimeout(() => {
                navigate(role === "admin" ? "/admin/order" : "/order");
            }, 1500);
            
        } catch (err) {
            console.error("Error converting quotation to order:", err);
            const errorMessage = err.response?.data?.message || 
                               err.message || 
                               "Failed to convert quotation to order";
            
            toast.current.show({
                severity: "error",
                summary: "Conversion Failed",
                detail: errorMessage,
                life: 5000,
            });
        } finally {
            setConverting(false);
        }
    };

    const downloadAllFiles = async () => {
        if (!quotation?.files || quotation.files.length === 0) {
            toast.current.show({
                severity: 'warn',
                summary: 'No Files',
                detail: 'No files available for download',
                life: 3000,
            });
            return;
        }

        try {
            const zip = new JSZip();
            const promises = quotation.files.map(async (filePath, index) => {
                const fullUrl = `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${filePath}`;
                const fileName = filePath.split('/').pop() || `file-${index + 1}`;
                
                try {
                    const response = await fetch(fullUrl);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const blob = await response.blob();
                    zip.file(fileName, blob);
                } catch (fileError) {
                    console.error(`Failed to download file: ${fileName}`, fileError);
                    // Create an empty file with error message
                    zip.file(`error-${fileName}.txt`, `Failed to download: ${fileName}`);
                }
            });

            await Promise.all(promises);
            
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `${quotation.designName || 'quotation'}_files.zip`);
            
            toast.current.show({
                severity: 'success',
                summary: 'Download Started',
                detail: 'All files are being downloaded as a ZIP archive',
                life: 3000,
            });
        } catch (error) {
            console.error('Error creating ZIP file:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Download Failed',
                detail: 'Could not download files. Please try again.',
                life: 3000,
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-gray-600 p-4 min-h-screen"
                style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif' }}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mr-3"></div>
                <span>Loading quotation details...</span>
            </div>
        );
    }
    
    if (error || !quotation) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-red-500 p-4 min-h-screen"
                style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }}>
                <span>{error || "Quotation not found"}</span>
            </div>
        );
    }

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <Toast ref={toast} />
            <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl mt-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Quotation Details</h2>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{quotation.designName}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Fabric:</p>
                        <p>{quotation.fabric}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Fabric Type:</p>
                        <p>{quotation.fabricType}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Colors:</p>
                        <p>{quotation.colors?.join(", ") || "No colors specified"}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Price:</p>
                        <p>${quotation.price ?? 0}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Dimensions:</p>
                        <p>{quotation.width} x {quotation.height}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Status:</p>
                        <p className="capitalize">{quotation.status}</p>
                    </div>
                    {quotation.formatRequired && (
                        <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                            <p className="font-semibold">Format Required:</p>
                            <p>{quotation.formatRequired}</p>
                        </div>
                    )}
                    {quotation.additionalInformation && (
                        <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md md:col-span-2">
                            <p className="font-semibold">Additional Information:</p>
                            <p>{quotation.additionalInformation}</p>
                        </div>
                    )}
                </div>

                {role === "admin" && quotation.files && quotation.files.length > 0 && (
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md mb-4">
                        <p className="font-semibold mb-2">Files:</p>
                        <Button
                            label="Download All Files"
                            icon="pi pi-download"
                            className="p-button-sm bg-blue-500 hover:bg-blue-600"
                            onClick={downloadAllFiles}
                            style={{ borderStyle: "none" }}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {quotation.files.length} file(s) available
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button
                        label="Back"
                        icon="pi pi-arrow-left"
                        className="p-button-secondary"
                        onClick={() => navigate(-1)}
                        style={{ borderStyle: "none" }}
                    />
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        {role === "admin" ? (
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                className="bg-yellow-500 hover:bg-yellow-600"
                                onClick={() => handleEdit(quotation)}
                                style={{ borderStyle: "none" }}
                            />
                        ) : (
                            <Button
                                label={converting ? "Converting..." : "Convert to Order"}
                                icon={converting ? "pi pi-spin pi-spinner" : "pi pi-shopping-cart"}
                                className="bg-green-500 hover:bg-green-600"
                                onClick={convertToOrder}
                                disabled={converting}
                                style={{ borderStyle: "none" }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetail;