import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuotationById } from "../../Services/Api";
import { createOrder } from "../../Services/Api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
    if (user?.role === "admin") {
      navigate(`/admin/quotation/edit/${quotation._id}`, { state: quotation });
    } else if (user?.role === "user") {
      navigate(`/quotation/edit/${quotation._id}`, { state: quotation });
    } else {
      navigate(`/`);
    }
  };

  // ✅ Convert Quotation → Order (multipart/form-data)
  const convertToOrder = async () => {
    if (!quotation) return;
    setConverting(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      // Helper function to format date
      const formatDateToMMDDYYYY = (dateString) => {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

      // ✅ Create FormData object
      const formData = new FormData();
      formData.append("user", userData.id);
      formData.append("designName", quotation.designName?.trim() || "");
      formData.append("fabricType", quotation.fabricType || "");
      formData.append("fabric", quotation.fabric?.trim() || "");
      formData.append("noOfColors", quotation.noOfColors || 0);
      formData.append(
        "colors",
        Array.isArray(quotation.colors)
          ? quotation.colors.join(",")
          : quotation.colors || ""
      );
      formData.append("measurement", quotation.measurement || "");
      formData.append("width", quotation.width || 0);
      formData.append("height", quotation.height || 0);
      formData.append("stitchRange", quotation.stitchRange?.toString() || "");
      formData.append("formatRequired", quotation.formatRequired || "");
      formData.append(
        "timeToComplete",
        formatDateToMMDDYYYY(quotation.timeToComplete)
      );
      formData.append(
        "additionalInformation",
        quotation.additionalInformation?.trim() || ""
      );
      formData.append("totalPrice", quotation.price || 0);
      formData.append("status", "inprogress");

      // ✅ Add files (both uploaded files or existing URLs)
      if (quotation.files && quotation.files.length > 0) {
        for (const file of quotation.files) {
          if (typeof file === "string") {
            // Fetch the file if it's a URL
            const fileUrl = `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${file}`;
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            const fileName = file.split("/").pop();
            formData.append("files", blob, fileName);
          } else {
            // If it's already a file object
            formData.append("files", file);
          }
        }
      }

      // ✅ Create the order using FormData
      const result = await createOrder(formData, token);

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
        detail:
          err.response?.data?.message ||
          "Failed to convert quotation to order",
        life: 3000,
      });
    } finally {
      setConverting(false);
    }
  };

  // ✅ Download all quotation files as ZIP
  const downloadAllFiles = async () => {
    try {
      const zip = new JSZip();
      const promises = quotation.files.map(async (filePath) => {
        const fullUrl = `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/${filePath}`;
        const fileName = filePath.split("/").pop();
        const response = await fetch(fullUrl);
        const blob = await response.blob();
        zip.file(fileName, blob);
      });

      await Promise.all(promises);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "quotation_files.zip");

      toast.current.show({
        severity: "success",
        summary: "Download Started",
        detail: "All files are being downloaded as a ZIP archive",
        life: 3000,
      });
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      toast.current.show({
        severity: "error",
        summary: "Download Failed",
        detail: "Could not download files",
        life: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 p-4 min-h-screen text-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mr-3"></div>
        <span>Loading quotation details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-red-500 p-4 min-h-screen text-lg">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <Toast ref={toast} />
      <div className="bg-white shadow-lg rounded-lg p-6 mx-auto max-w-4xl mt-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Quotation Details
        </h2>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {quotation.designName}
        </h3>

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
              <Button
                label={converting ? "Converting..." : "Convert to Order"}
                icon={
                  converting ? "pi pi-spin pi-spinner" : "pi pi-shopping-cart"
                }
                className="bg-yellow-500 hover:bg-yellow-600"
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
