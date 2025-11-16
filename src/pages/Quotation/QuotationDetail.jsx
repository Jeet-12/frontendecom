import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuotationById } from "../../Services/Api";
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
                console.log(data);
                
                setQuotation(data);
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

    // Custom createOrder function that properly handles FormData
    const createOrderWithFormData = async (formData, token) => {
        try {
            const API_BASE_URL = "http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api";
            
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type - let browser set it with boundary
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    };

    // Function to convert quotation to order
    const convertToOrder = async () => {
        if (!quotation) return;

        setConverting(true);
        try {
            const userData = JSON.parse(localStorage.getItem("user"));
            
            // Format the date to MM/DD/YYYY
            const formatDateToMMDDYYYY = (dateString) => {
                const date = new Date(dateString);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            };

            // Create FormData object for multipart/form-data
            const formData = new FormData();
            
            // Append all fields as form data (exactly matching your expected format)
            formData.append('user', userData.id);
            formData.append('designName', quotation.designName?.trim() || "jeet");
            formData.append('fabricType', quotation.fabricType || "Soft");
            formData.append('fabric', quotation.fabric?.trim() || "Febric1");
            formData.append('noOfColors', String(Number(quotation.noOfColors) || 3));
            formData.append('colors', quotation.colors?.join(',') || "jdbcjbsbjv,dbfisbf");
            formData.append('measurement', quotation.measurement || "inches");
            formData.append('width', String(Number(quotation.width) || 100));
            formData.append('height', String(Number(quotation.height) || 100));
            formData.append('stitchRange', quotation.stitchRange?.toString() || "7000-10000");
            formData.append('formatRequired', quotation.formatRequired || "Pfaff *.KSM");
            formData.append('timeToComplete', formatDateToMMDDYYYY(quotation.timeToComplete) || "11/04/2025");
            formData.append('additionalInformation', quotation.additionalInformation?.trim() || "dcjbsjvbdfviudfvu");
            formData.append('totalPrice', String(quotation.price || 0));
            formData.append('status', "inprogress");

            // Debug: Log FormData contents
            console.log("FormData contents:");
            for (let [key, value] of formData.entries()) {
                console.log(key + ": " + value);
            }

            // Use the custom createOrder function
            const result = await createOrderWithFormData(formData, token);
            console.log("Order creation result:", result);
            
            toast.current.show({
                severity: "success",
                summary: "Order Created",
                detail: result.message || "Order created successfully!",
                life: 3000,
            });
            
            // Navigate to orders page after successful creation
            navigate("/order");
            
        } catch (err) {
            console.error("Error converting quotation to order:", err);
            toast.current.show({
                severity: "error",
                summary: "Conversion Failed",
                detail: err.response?.data?.message || err.message || "Failed to convert quotation to order",
                life: 3000,
            });
        } finally {
            setConverting(false);
        }
    };

    // Alternative approach if FormData doesn't work - using raw multipart format
    const convertToOrderRaw = async () => {
        if (!quotation) return;

        setConverting(true);
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
                totalPrice: String(quotation.price || 0),
                status: "inprogress",
                files: "" // Empty files field
            };


            // Build multipart body
            Object.entries(fields).forEach(([key, value]) => {
                body += `--${boundary}\r\n`;
                body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
                body += `${value}\r\n`;
            });

            body += `--${boundary}--\r\n`;

            const API_BASE_URL = "http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api";
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
            setConverting(false);
        }
    };

    const downloadAllFiles = async () => {
        try {
            const zip = new JSZip();
            const promises = quotation.files.map(async (filePath, index) => {
                const fullUrl = `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${filePath}`;
                const fileName = filePath.split('/').pop();
                
                const response = await fetch(fullUrl);
                const blob = await response.blob();
                zip.file(fileName, blob);
            });

            await Promise.all(promises);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'quotation_files.zip');
            
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
                detail: 'Could not download files',
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
    
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-red-500 p-4 min-h-screen"
                style={{ fontSize: '18px', fontFamily: 'Arial, sans-serif' }}>
                <span>{error}</span>
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
                        <p>{quotation.colors.join(", ")}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md text-black">
                        <p className="font-semibold">Price:</p>
                        <p>{quotation.price ?? 0}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Stitch Range:</p>
                        <p>{quotation.stitchRange}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Format Required:</p>
                        <p>{quotation.formatRequired}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Dimensions:</p>
                        <p>{quotation.width} x {quotation.height} {quotation.measurement}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Completion Date:</p>
                        <p>{new Date(quotation.timeToComplete).toLocaleDateString()}</p>
                    </div>
                    {quotation.additionalInformation && (
                        <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md md:col-span-2">
                            <p className="font-semibold">Additional Information:</p>
                            <p>{quotation.additionalInformation}</p>
                        </div>
                    )}
                    {role === "admin" && quotation.files && quotation.files.length > 0 && (
                        <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md md:col-span-2">
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
                </div>

                <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="ml-auto">
                        {role === "admin" ? (
                            <Button
                                label="Edit"
                                icon="pi pi-pencil"
                                className="bg-yellow-500 hover:bg-yellow-600"
                                onClick={() => handleEdit(quotation)}
                                style={{ borderStyle: "none" }}
                            />
                        ) : (
                            <>
                                {/* <Button
                                    label={converting ? "Converting..." : "Convert to Order"}
                                    icon={converting ? "pi pi-spin pi-spinner" : "pi pi-shopping-cart"}
                                    className="bg-yellow-500 hover:bg-yellow-600 mr-2"
                                    onClick={convertToOrder}
                                    disabled={converting}
                                    style={{ borderStyle: "none" }}
                                /> */}
                                <Button
                                    label={converting ? "Converting..." : "Convert to Order"}
                                    icon={converting ? "pi pi-spin pi-spinner" : "pi pi-shopping-cart"}
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={convertToOrderRaw}
                                    disabled={converting}
                                    style={{ borderStyle: "none" }}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuotationDetail;