import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../Services/Api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FaEdit, FaCheckCircle, FaFileUpload, FaTimes, FaFileDownload, FaEye, FaVideo } from "react-icons/fa";
import axios from "axios";

const OrderDetail = () => {
    let { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [previewImages, setPreviewImages] = useState([]);
    const [digitalFiles, setDigitalFiles] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const toast = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const openModal = () => {
        const imgPath = Array.isArray(order.previewImage) ? order.previewImage[0] : order.previewImage;
        setImageUrl(`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${imgPath}`);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateOrderStatus(id, newStatus, token);
            setOrder(prev => ({
                ...prev,
                status: newStatus
            }));
            toast.current.show({
                severity: "success",
                summary: "Status Updated",
                detail: `Order marked as ${newStatus}`,
                life: 3000
            });
        } catch (err) {
            console.error("Error updating order status:", err);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update order status",
                life: 3000
            });
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setRole(user.role);

        const fetchOrder = async () => {
            try {
                const data = await getOrderById(id, token);
                setOrder(data);
                console.log("Order Data:", data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch order details.");
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, token]);

    const createPaypalOrder = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(
                `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/payment/paypal/create-payment`,
                { "orderId": id },
                {
                    headers: {
                        'x-auth-token': token,
                    }
                });

            window.location.href = data.links;
        } catch (error) {
            const status = error.response?.status;
            if (status === 401) {
                localStorage.clear();
                toast.current.show({
                    severity: "error",
                    summary: "Session Expired",
                    detail: "Please log in again.",
                    life: 3000
                });
                navigate('/login');
                return;
            }
            setLoading(false);
        }
    };

    const handleImageUpload = (e, type) => {
        const files = Array.from(e.target.files);

        if (type === "preview") {
            const validFiles = files;

            if (validFiles.length > 0) {
                setPreviewImages(prev => [...prev, ...validFiles]);
                toast.current.show({
                    severity: "success",
                    summary: "Files Uploaded",
                    detail: `${validFiles.length} preview file(s) added successfully.`,
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Invalid Files",
                    detail: "Please upload valid images, PDFs, or videos.",
                    life: 3000,
                });
            }
        } else if (type === "digital") {
            const validFiles = files;

            if (validFiles.length > 0) {
                setDigitalFiles(prev => [...prev, ...validFiles]);
                toast.current.show({
                    severity: "success",
                    summary: "Files Uploaded",
                    detail: `${validFiles.length} digitized file(s) added.`,
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Invalid Files",
                    detail: "Please upload valid production files (.zip, .dst, .emb) or videos.",
                    life: 3000,
                });
            }
        }
    };

    const removePreviewImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeDigitalFile = (index) => {
        setDigitalFiles(prev => prev.filter((_, i) => i !== index));
    };



    const handleSubmit = async () => {
        if (previewImages.length > 0 || digitalFiles.length > 0) {
            const formData = new FormData();

            previewImages.forEach((file) => {
                formData.append("previewImage", file);
            });

            digitalFiles.forEach((file) => {
                formData.append("digitalImage", file);
            });

            setUploading(true);
            setProgress(0);
            try {
                const response = await axios.patch(
                    `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/order/${id}/update-images`,
                    formData,
                    {
                        headers: {
                            "x-auth-token": token,
                            "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgress(percentCompleted);
                        },
                    }
                );

                if (response.status === 200 || response.status === 201) {
                    toast.current.show({
                        severity: "success",
                        summary: "Files Uploaded",
                        detail: response.data.message || "Files updated successfully",
                        life: 3000,
                    });
                    const updatedOrder = await getOrderById(id, token);
                    setOrder(updatedOrder);
                    setTimeout(() => {
                        navigate('/admin/order');
                    }, 1500);
                    setPreviewImages([]);
                    setDigitalFiles([]);
                } else {
                    throw new Error("Failed to upload files.");
                }
            } catch (error) {
                console.error("Upload error:", error);
                let errorMessage = "Failed to upload files.";
                if (error.message === "Network Error" || error.code === "ERR_CONNECTION_RESET") {
                    errorMessage = "Connection reset by server. This usually happens when the file is too large for the server to process.";
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
                
                toast.current.show({
                    severity: "error",
                    summary: "Upload Error",
                    detail: errorMessage,
                    life: 5000,
                });
            } finally {
                setUploading(false);
                setProgress(0);
            }
        } else {
            toast.current.show({
                severity: "error",
                summary: "Missing Files",
                detail: "Please upload at least one preview file or digitized file before submitting.",
                life: 3000,
            });
        }
    };

    const handleEdit = () => {
        if (role === "admin") {
            navigate(`/admin/order/edit/${order._id}`, { state: order });
        } else if (role === "user") {
            navigate(`/order/edit/${order._id}`, { state: order });
        } else {
            navigate(`/`);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white text-gray-600 p-4 min-h-screen"
                style={{ fontSize: '24px', fontFamily: 'Arial, sans-serif' }}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mr-3"></div>
                <span>Loading order details...</span>
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
        <div className="p-4 min-h-screen bg-white">
            <Toast ref={toast} />
            <div className="bg-white shadow-xl rounded-lg p-6 mx-auto max-w-4xl mt-8">
                <h2 className="text-4xl font-semibold text-gray-800 mb-6">Order Details</h2>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">{order.designName}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Fabric:</p>
                        <p>{order.fabric}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Fabric Type:</p>
                        <p>{order.fabricType}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Colors:</p>
                        <p>{Array.isArray(order.colors) ? order.colors.join(", ") : (order.colors || "Not specified")}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Number of Colors:</p>
                        <p>{order.noOfColors}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Total Price:</p>
                        <p>$ {order.price || 0}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Status:</p>
                        {role === 'admin' ? (
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(e.target.value)}
                                className="mt-2 w-full border-2 border-gray-300 rounded-md p-3 bg-white focus:ring-2 focus:ring-green-500 transition-all duration-200"
                            >
                                <option value="pending">Pending</option>
                                <option value="inprogress">In Progress</option>
                                <option value="complete">Complete</option>
                            </select>
                        ) : (
                            <p className="mt-2 text-xl">{order.status}</p>
                        )}
                    </div>

                    {/* Stitch Count - Show for both admin and user */}
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Stitch Count:</p>
                        <p>{order.stitching_count ? order.stitching_count.toLocaleString() : "Not specified"}</p>
                    </div>

                    {/* Stitch Range - Show for both admin and user */}
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Stitch Range:</p>
                        <p>{order.stitchRange || "Not specified"}</p>
                    </div>

                    {/* Width and Height */}
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Dimensions:</p>
                        <p>{order.width} {order.measurement} x {order.height} {order.measurement}</p>
                    </div>

                    {/* Format Required */}
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Format Required:</p>
                        <p>{order.formatRequired || "Not specified"}</p>
                    </div>

                    {/* Time to Complete */}
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Time to Complete:</p>
                        <p>{new Date(order.timeToComplete).toLocaleDateString()}</p>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Payment Status:</p>
                        <p className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' :
                                order.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {order.paymentStatus || "Pending"}
                        </p>
                    </div>
                </div>

                {/* Additional Information - Show for both admin and user */}
                {order.additionalInformation && (
                    <div className="mb-6">
                        <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                            <p className="font-semibold text-lg mb-2">Additional Information:</p>
                            <p className="text-gray-700">{order.additionalInformation}</p>
                        </div>
                    </div>
                )}


                {order.comment && (
                    <div className="mb-6">
                        <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                            <p className="font-semibold text-lg mb-2">Admin Comment:</p>
                            <p className="text-gray-700">{order.comment}</p>
                        </div>
                    </div>
                )}

                {/* Attached Files - Show only for admin */}
                {role === 'admin' && order.files && order.files.length > 0 && (
                    <div className="mb-6">
                        <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                            <p className="font-semibold text-lg mb-2">Attached Files:</p>
                            <div className="flex flex-wrap gap-2">
                                {order.files.map((file, index) => (
                                    <a
                                        key={index}
                                        href={file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <FaFileDownload />
                                        <span className="truncate max-w-xs">{file.split('/').pop()}</span>
                                    </a>
                                ))} 
                            </div>
                        </div>
                    </div>
                )}

                {/* Order ID and Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Order ID:</p>
                        <p className="text-sm font-mono">{order.uniqueId || order._id}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Created:</p>
                        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Last Updated:</p>
                        <p>{new Date(order.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Completed Files Download Section for Customer (Show only if Paid) */}
                {role === 'user' && order.paymentStatus === 'Paid' && (
                    <div className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
                        <h4 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
                            <FaFileDownload /> Download Your Completed Design
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Preview Files (Images & Videos) */}
                            <div>
                                <h5 className="font-semibold text-lg mb-2 text-gray-700">Stitch Out Previews (Images/Videos)</h5>
                                {order.previewImage ? (
                                    <div className="flex flex-wrap gap-4">
                                        {(Array.isArray(order.previewImage) ? order.previewImage : [order.previewImage]).map((file, idx) => {
                                            const isVideo = typeof file === 'string' && (file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".mov") || file.toLowerCase().endsWith(".webm"));
                                            return isVideo ? (
                                                <div key={idx} className="flex flex-col gap-2">
                                                    <video 
                                                        src={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`} 
                                                        className="w-full max-w-xs rounded-lg shadow-md border border-green-200"
                                                        controls
                                                    />
                                                    <a
                                                        href={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`}
                                                        download
                                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-md"
                                                    >
                                                        <FaFileDownload /> Download Video
                                                    </a>
                                                </div>
                                            ) : (
                                                <a
                                                    key={idx}
                                                    href={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm text-green-700 font-medium"
                                                >
                                                    <FaEye /> View Preview {idx + 1}
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No previews available.</p>
                                )}
                            </div>

                            {/* Digitized Production Files */}
                            <div>
                                <h5 className="font-semibold text-lg mb-2 text-gray-700">Digitized Production Files</h5>
                                {order.digitalImage ? (
                                    <div className="flex flex-wrap gap-4">
                                        {(Array.isArray(order.digitalImage) ? order.digitalImage : [order.digitalImage]).map((file, idx) => {
                                            const isVideo = typeof file === 'string' && (file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".mov") || file.toLowerCase().endsWith(".webm"));
                                            return isVideo ? (
                                                <div key={idx} className="flex flex-col gap-2">
                                                    <video 
                                                        src={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`} 
                                                        className="w-full max-w-xs rounded-lg shadow-md border border-green-200"
                                                        controls
                                                    />
                                                    <a
                                                        href={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`}
                                                        download
                                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-md"
                                                    >
                                                        <FaFileDownload /> Download Video
                                                    </a>
                                                </div>
                                            ) : (
                                                <a
                                                    key={idx}
                                                    href={`http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`}
                                                    download
                                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-black rounded-lg hover:bg-green-700 transition-colors text-sm font-bold shadow-md"
                                                >
                                                    <FaFileDownload /> Download File {idx + 1}
                                                </a>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No production files available yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {role === "admin" && order.status === "complete" && (
                    <div className="mb-8">
                        <h4 className="font-semibold text-2xl mb-4">Upload Files</h4>

                        {/* Preview Files Upload */}
                        <div className="mb-6">
                            <h5 className="font-semibold text-lg mb-2">Preview Images & Videos</h5>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <Button
                                    label="Upload Previews"
                                    onClick={() => document.getElementById("file-preview").click()}
                                    icon={<FaFileUpload />}
                                    className="p-button-outlined p-button-rounded"
                                    style={{ borderStyle: "none", backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)' }}
                                    disabled={false}
                                />
                                <input
                                    type="file"
                                    id="file-preview"
                                    accept="*"
                                    onChange={(e) => handleImageUpload(e, "preview")}
                                    className="hidden"
                                    multiple
                                />
                            </div>

                            {previewImages.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Selected preview files:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {previewImages.map((file, index) => (
                                            <div key={index} className="relative border rounded p-2">
                                                <p className="text-xs truncate">{file.name}</p>
                                                <button
                                                    onClick={() => removePreviewImage(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Digital Files Upload */}
                        <div className="mb-6">
                            <h5 className="font-semibold text-lg mb-2">Digitized Files & Videos</h5>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <Button
                                    label="Upload Digitized Files"
                                    onClick={() => document.getElementById("file-digital").click()}
                                    icon={<FaFileUpload />}
                                    className="p-button-outlined p-button-rounded"
                                    style={{ borderStyle: "none", backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)' }}
                                    disabled={false}
                                />
                                <input
                                    type="file"
                                    id="file-digital"
                                    accept="*"
                                    onChange={(e) => handleImageUpload(e, "digital")}
                                    className="hidden"
                                    multiple
                                />
                            </div>

                            {digitalFiles.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-2">Selected digital files:</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {digitalFiles.map((file, index) => (
                                            <div key={index} className="relative border rounded p-2">
                                                <p className="text-xs truncate">{file.name}</p>
                                                <button
                                                    onClick={() => removeDigitalFile(index)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col gap-4">
                            {uploading && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                                    <div 
                                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                    <p className="text-center text-xs mt-1 font-semibold text-gray-600">Uploading: {progress}%</p>
                                </div>
                            )}
                            <Button
                                label={uploading ? "Uploading..." : "Submit Files"}
                                icon={uploading ? "pi pi-spin pi-spinner" : <FaCheckCircle />}
                                onClick={handleSubmit}
                                className="p-button-success p-button-rounded w-full"
                                style={{ borderStyle: "none", backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)' }}
                                disabled={uploading || (previewImages.length === 0 && digitalFiles.length === 0)}
                            />
                        </div>
                    </div>
                )}

                {role === "admin" ? (
                    <div className="flex justify-between mt-8">
                        <Button
                            label="Go Back"
                            icon="pi pi-arrow-left"
                            onClick={() => navigate("/admin/order")}
                            className="p-button p-button-rounded"
                            style={{ backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)', borderStyle: "none" }}
                        />
                        <Button
                            label="Edit Order"
                            icon={<FaEdit />}
                            onClick={handleEdit}
                            className="p-button p-button-rounded"
                            style={{ backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)', borderStyle: "none" }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row gap-4 mt-4">
                        {order.status === "complete" && (
                            <>
                                <Button
                                    label="Make Transaction"
                                    icon="pi pi-money-bill"
                                    className="p-button p-button-rounded"
                                    style={{ backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)', borderStyle: "none" }}
                                    onClick={createPaypalOrder}
                                    disabled={loading}
                                />

                                <Button
                                    label="Open Preview"
                                    onClick={openModal}
                                    className="p-button p-button-rounded"
                                    style={{ backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)', borderStyle: "none" }}
                                />
                            </>
                        )}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full mx-4 relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                &times;
                            </button>
                            <h4 className="text-2xl font-semibold mb-4">Image Preview</h4>
                            <div className="flex justify-center items-center max-h-[70vh] overflow-auto">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-w-full max-h-[65vh] object-contain rounded-lg"
                                    crossOrigin="anonymous"
                                />
                            </div>
                            <p className="text-gray-500 text-sm mt-2 text-center">
                                *This image is watermarked for preview purposes.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetail;