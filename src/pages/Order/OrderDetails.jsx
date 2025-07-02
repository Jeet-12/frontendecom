import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../../Services/Api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FaEdit, FaCheckCircle, FaFileUpload } from "react-icons/fa";
import axios from "axios";

const OrderDetail = () => {
    let { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [digitalImage, setDigitalImage] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const toast = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const openModal = () => {
        setImageUrl(`${process.env.API_URL}${order.previewImage}`);
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
            console.log(error);
            setLoading(false);
        }
    };

    const handleImageUpload = (e, type) => {
        const file = e.target.files[0];

        if (type === "preview") {
            const validImageTypes = ["image/png", "image/jpeg", "application/pdf"];
            if (file && validImageTypes.includes(file.type)) {
                setPreviewImage(file);
                toast.current.show({
                    severity: "success",
                    summary: "File Uploaded",
                    detail: "Preview image uploaded successfully.",
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Invalid File",
                    detail: "Please upload a valid image (PNG, JPEG) or PDF.",
                    life: 3000,
                });
            }
        } else if (type === "digital") {
            const validDigitalTypes = ["application/zip", "application/x-zip-compressed", "multipart/x-zip"];
            const isZipFile = file?.name.toLowerCase().endsWith(".zip");
            if (file && (validDigitalTypes.includes(file.type) || isZipFile)) {
                setDigitalImage(file);
                toast.current.show({
                    severity: "success",
                    summary: "File Uploaded",
                    detail: "Digital file uploaded successfully.",
                    life: 3000,
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Invalid File",
                    detail: "Please upload a valid .zip file.",
                    life: 3000,
                });
            }
        }
    };

    const handleSubmit = async () => {
        if (previewImage && digitalImage) {
            const formData = new FormData();
            formData.append("previewImage", previewImage);
            formData.append("digitalImage", digitalImage);

            try {
                const response = await fetch(`${process.env.API_URL}api/order/${id}/update-images`, {
                    method: "PATCH",
                    headers: {
                        "x-auth-token": token,
                    },
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    toast.current.show({
                        severity: "success",
                        summary: "Images Uploaded",
                        detail: result.message,
                        life: 3000,
                    });
                    // Refresh order data to show the new images
                    const updatedOrder = await getOrderById(id, token);
                    setOrder(updatedOrder);
                } else {
                    throw new Error("Failed to upload images.");
                }
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Upload Error",
                    detail: error.message,
                    life: 3000,
                });
            }
        } else {
            toast.current.show({
                severity: "error",
                summary: "Missing Images",
                detail: "Please upload both images before submitting.",
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
                        <p>{order.colors.join(", ")}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Quantity:</p>
                        <p>{order.quantity ?? 0}</p>
                    </div>
                    <div className="bg-[#f8fafc] p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                        <p className="font-semibold text-lg">Total Price:</p>
                        <p>$ {order.totalPrice ?? 0}</p>
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
                </div>

                {role === "admin" && order.status === "complete" && (
                    <div className="mb-8">
                        <h4 className="font-semibold text-2xl">Upload Files</h4>
                        <div className="flex gap-4 mb-4">
                            <div>
                                <Button
                                    label="Upload Preview"
                                    onClick={() => document.getElementById("file-preview").click()}
                                    icon={<FaFileUpload />}
                                    className="p-button-outlined p-button-rounded w-full"
                                    style={{ borderStyle: "none", backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)' }}
                                />
                                <input
                                    type="file"
                                    id="file-preview"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => handleImageUpload(e, "preview")}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <Button
                                    label="Upload Digital File"
                                    onClick={() => document.getElementById("file-digital").click()}
                                    icon={<FaFileUpload />}
                                    className="p-button-outlined p-button-rounded w-full"
                                    style={{ borderStyle: "none", backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)' }}
                                />
                                <input
                                    type="file"
                                    id="file-digital"
                                    accept=".zip"
                                    onChange={(e) => handleImageUpload(e, "digital")}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                label="Submit"
                                icon={<FaCheckCircle />}
                                onClick={handleSubmit}
                                className="p-button-success p-button-rounded w-full"
                                style={{ borderStyle: "none", backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)' }}
                            />
                        </div>
                    </div>
                )}

                {role === "admin" ? (
                    <div className="flex justify-between mt-8">
                        <Button
                            label="Edit Order"
                            icon={<FaEdit />}
                            onClick={handleEdit}
                            className="p-button p-button-rounded"
                            style={{ backgroundColor: 'rgb(147, 197, 114)', borderColor: 'rgb(147, 197, 114)', borderStyle: "none" }}
                        />
                        <Button
                            label="Go Back"
                            icon="pi pi-arrow-left"
                            onClick={() => navigate("/admin/order")}
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