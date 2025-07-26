import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuotationById, approveQuotation, rejectQuotation } from "../../Services/Api";
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
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const toast = useRef(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                const data = await getQuotationById(id, token);
                setQuotation(data);
                console.log(data)
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

    const handleApproval = async (status) => {
        try {
            if (status === "approve") {
                await approveQuotation(id, token);
            } else {
                await rejectQuotation(id, token);
            }

            setQuotation((prev) => ({
                ...prev,
                status: status === "approve" ? "Approved" : "Rejected",
            }));
            toast.current.show({
                severity: "success",
                summary: "Status Updated",
                detail: `Quotation marked as ${status}`,
                life: 3000,
            });
        } catch (err) {
            console.error("Error updating quotation status:", err);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update quotation status",
                life: 3000,
            });
        }
    };

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

    const downloadAllFiles = async () => {
  try {
    const zip = new JSZip();
    const promises = quotation.files.map(async (filePath, index) => {
      const fullUrl = `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${filePath}`;
      const fileName = filePath.split('/').pop();
      
      // Fetch each file
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      
      // Add to ZIP
      zip.file(fileName, blob);
    });

    // Wait for all files to be added
    await Promise.all(promises);
    
    // Generate the ZIP file
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
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Quantity:</p>
                        <p>{quotation.quantity ?? 0}</p>
                    </div>
                    {/* <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Total Price:</p>
                        <p>${quotation.totalPrice}</p>
                    </div> */}
                    <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
                        <p className="font-semibold">Status:</p>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${quotation.status === 'approved'
                                ? 'bg-[#d1fae5] text-[#065f46]' // bg-green-100 text-green-800
                                : quotation.status === 'inprogress'
                                    ? 'bg-[#fef3c7] text-[#92400e]' // bg-yellow-100 text-yellow-800
                                    : quotation.status === 'declined'
                                        ? 'bg-[#fee2e2] text-[#991b1b]' // bg-red-100 text-red-800
                                        : 'bg-[#f3f4f6] text-[#1f2937]' // bg-gray-100 text-gray-800
                                }`}
                        >
                            {quotation.status}
                        </span>
                    </div>
                    {role === "admin" && quotation.files && quotation.files.length > 0 && (
                        <div className="bg-[#f8fafc] p-4 rounded-lg shadow-md">
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
                    {/* Admin-specific actions */}
                    {role === "admin" && (
                        <div className="flex space-x-2">
                            <Button
                                label="Approve"
                                icon="pi pi-check"
                                className="bg-[#22c55e] hover:bg-[#16a34a]"
                                onClick={() => handleApproval("approve")}
                                disabled={quotation.status === "Approved"}
                                style={{ borderStyle: "none" }}
                            />
                            <Button
                                label="Reject"
                                icon="pi pi-times"
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleApproval("reject")}
                                disabled={quotation.status === "Rejected"}
                                style={{ borderStyle: "none" }}
                            />
                        </div>
                    )}

                    {/* Common Edit button for both Admin and User */}
                    {(role === "admin" || role === "user") && (
                        <Button
                            label="Edit"
                            icon="pi pi-pencil"
                            className="bg-yellow-500 hover:bg-yellow-600"
                            onClick={() => handleEdit(quotation)}
                            style={{ borderStyle: "none" }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuotationDetail;
