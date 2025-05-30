import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { updateOrder, updateQuotation } from "../../Services/Api"; // Your API call for updating quotations


const EditOrder = () => {
  const { state: order } = useLocation(); 
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      designName: order.designName,
      fabricType: order.fabricType,
      fabric: order.fabric,
      noOfColors: order.noOfColors,
      colors: order.colors.join(", "), // Convert array to string for input
      width: order.width,
      height: order.height,
      totalPrice:order.totalPrice,
      stitchRange: order.stitchRange,
      formatRequired: order.formatRequired,
      timeToComplete: new Date(order.timeToComplete).toISOString().split("T")[0], // Format date
      additionalInformation: order.additionalInformation,
    },
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
};
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Prepare the updated quotation data
      const updatedData = {
        designName: data.designName,
        fabricType: data.fabricType,
        fabric: data.fabric,
        noOfColors: Number(data.noOfColors),
        colors: data.colors.split(",").map(color => color.trim()), // Convert back to array
        width: Number(data.width),
        height: Number(data.height),
        stitchRange: data.stitchRange,
        formatRequired: data.formatRequired,
        timeToComplete: formatDate(new Date(data.timeToComplete)),// Send as ISO string
        additionalInformation: data.additionalInformation,
      };

      // // Call your updateQuotation API
      // // console.log(order._id, updatedData, token)
      // const result = await updateOrder(order._id, updatedData, token);
      // toast.success(result.message || "Quotation updated successfully!");
      // navigate("/admin/order"); // Redirect after updating

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === 'admin') {
        // console.log(user?.role)
          try {
              const result = await updateOrder(order._id, updatedData, token);
              toast.success(result.message || "Order updated successfully!");
              navigate(`/admin/order`);
          } catch (error) {
              toast.error(error.message || "Failed to update Order.");
          }
      } else if (user?.role === 'user') {
          try {
              const result = await updateOrder(order._id, updatedData, token);
              toast.success(result.message || "Order updated successfully!");
              navigate(`/order`);
          } catch (error) {
              toast.error(error.message || "Failed to update Order.");
          }
      } else {
          toast.error("You are not authorized to perform this action.");
          navigate(`/`);
      }
      



    } catch (err) {
      console.error(err);
      toast.error(`Failed to update quotation: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <div className="flex flex-col justify-center bg-[#e6f0df] min-h-screen py-8">
      <div className="p-8 xs:p-0 mx-auto md:w-full max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-lg w-full rounded-lg p-4">
          <h2 className="text-3xl text-center text-[#93C572] font-bold mb-6">Edit Order</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Design Name */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Design Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.designName ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("designName", { required: "Design name is required" })}
                  placeholder="Enter design name"
                />
                {errors.designName && <p className="text-red-500 text-xs mt-1">{errors.designName.message}</p>}
              </div>

              {/* Fabric Type */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.fabricType ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("fabricType", { required: "Fabric type is required" })}
                  placeholder="Enter fabric type"
                />
                {errors.fabricType && <p className="text-red-500 text-xs mt-1">{errors.fabricType.message}</p>}
              </div>

              {/* Fabric */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.fabric ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("fabric", { required: "Fabric is required" })}
                  placeholder="Enter fabric"
                />
                {errors.fabric && <p className="text-red-500 text-xs mt-1">{errors.fabric.message}</p>}
              </div>

              {/* Number of Colors */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Number of Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={`border ${errors.noOfColors ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("noOfColors", { required: "Number of colors is required", min: 1 })}
                  placeholder="Enter number of colors"
                />
                {errors.noOfColors && <p className="text-red-500 text-xs mt-1">{errors.noOfColors.message}</p>}
              </div>

              {/* Colors */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.colors ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("colors", { required: "Colors are required" })}
                  placeholder="Enter colors separated by commas"
                />
                {errors.colors && <p className="text-red-500 text-xs mt-1">{errors.colors.message}</p>}
              </div>

              {/* Width */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Width (in inches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={`border ${errors.width ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("width", { required: "Width is required" })}
                  placeholder="Enter width"
                />
                {errors.width && <p className="text-red-500 text-xs mt-1">{errors.width.message}</p>}
              </div>

              {/* Height */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Height (in inches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={`border ${errors.height ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("height", { required: "Height is required" })}
                  placeholder="Enter height"
                />
                {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
              </div>

              {/* Stitch Range */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Stitch Range <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.stitchRange ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("stitchRange", { required: "Stitch range is required" })}
                  placeholder="Enter stitch range"
                />
                {errors.stitchRange && <p className="text-red-500 text-xs mt-1">{errors.stitchRange.message}</p>}
              </div>
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                Total Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.totalPrice ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("totalPrice", { required: "Total Price is required" })}
                  placeholder="Enter Total Price"
                />
                {errors.totalPrice && <p className="text-red-500 text-xs mt-1">{errors.totalPrice.message}</p>}
              </div>

              {/* Format Required */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.formatRequired ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("formatRequired", { required: "Format required is required" })}
                  placeholder="Enter format required"
                />
                {errors.formatRequired && <p className="text-red-500 text-xs mt-1">{errors.formatRequired.message}</p>}
              </div>

              {/* Time to Complete */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Time to Complete <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`border ${errors.timeToComplete ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("timeToComplete", { required: "Time to complete is required" })}
                />
                {errors.timeToComplete && <p className="text-red-500 text-xs mt-1">{errors.timeToComplete.message}</p>}
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Additional Information
                </label>
                <textarea
                  className={`border ${errors.additionalInformation ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("additionalInformation")}
                  placeholder="Enter any additional information"
                  rows="4"
                />
                {errors.additionalInformation && <p className="text-red-500 text-xs mt-1">{errors.additionalInformation.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className={`mt-6 w-full py-2 rounded-lg bg-[#93C572] text-white font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={isLoading || !isValid}
            >
              {isLoading ? "Updating order..." : "Update order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;

