import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { updateOrder } from "../../Services/Api";

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
      colors: order.colors.join(", "),
      measurement: order.measurement || "inches",
      width: order.width,
      height: order.height,
      totalPrice: order.totalPrice,
      stitchRange: order.stitchRange,
      formatRequired: order.formatRequired,
      timeToComplete: new Date(order.timeToComplete).toISOString().split("T")[0],
      additionalInformation: order.additionalInformation,
      price:
        order.price !== undefined && order.price !== null ? order.price : "",
      stitching_count:
        order.stitching_count !== undefined && order.stitching_count !== null
          ? order.stitching_count
          : "",
      comment: order.comment || "",
    },
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updatedData = {
        designName: data.designName,
        fabricType: data.fabricType,
        fabric: data.fabric,
        noOfColors: Number(data.noOfColors),
        totalPrice: Number(data.totalPrice),
        colors: data.colors.split(",").map((color) => color.trim()),
        measurement: data.measurement,
        width: Number(data.width),
        height: Number(data.height),
        stitchRange: data.stitchRange,
        formatRequired: data.formatRequired,
        timeToComplete: formatDate(new Date(data.timeToComplete)),
        additionalInformation: data.additionalInformation,
        ...(user?.role === "admin" && {
          price: data.price,
          stitching_count: Number(data.stitching_count),
          comment: data.comment,
        }),
      };

      const result = await updateOrder(order._id, updatedData, token);
      toast.success(result.message || "Order updated successfully!");
      navigate(user?.role === "admin" ? "/admin/order" : "/order");
    } catch (error) {
      toast.error(error.message || "Failed to update Order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center bg-[#e6f0df] min-h-screen py-8">
      <div className="p-8 xs:p-0 mx-auto md:w-full max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-lg w-full rounded-lg p-6">
          <h2 className="text-3xl text-center text-[#93C572] font-bold mb-6">
            Edit Order
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Design Name */}
            <div className="w-full md:w-1/2 mb-4">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Design Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`border ${
                  errors.designName ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2 text-sm w-full`}
                {...register("designName", { required: "Design name is required" })}
                placeholder="Enter design name"
              />
              {errors.designName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.designName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fabric Type */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.fabricType ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("fabricType", { required: "Fabric type is required" })}
                  placeholder="Enter fabric type"
                />
                {errors.fabricType && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fabricType.message}
                  </p>
                )}
              </div>

              {/* Fabric */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.fabric ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("fabric", { required: "Fabric is required" })}
                  placeholder="Enter fabric"
                />
                {errors.fabric && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fabric.message}
                  </p>
                )}
              </div>
            </div>

            {/* Colors and Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Number of Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={`border ${
                    errors.noOfColors ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("noOfColors", {
                    required: "Number of colors is required",
                    min: 1,
                  })}
                  placeholder="Enter number of colors"
                />
                {errors.noOfColors && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.noOfColors.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.colors ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("colors", { required: "Colors are required" })}
                  placeholder="Enter colors separated by commas"
                />
                {errors.colors && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.colors.message}
                  </p>
                )}
              </div>
            </div>

            {/* Measurement */}
            <div className="mt-6 md:w-1/2">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Measurement <span className="text-red-500">*</span>
              </label>
              <select
                className={`border ${
                  errors.measurement ? "border-red-500" : "border-gray-300"
                } rounded-lg px-3 py-2 text-sm w-full`}
                {...register("measurement", { required: "Measurement unit is required" })}
              >
                <option value="inches">Inches</option>
                <option value="cm">Centimeters (cm)</option>
              </select>
              {errors.measurement && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.measurement.message}
                </p>
              )}
            </div>

            {/* Width / Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Width
                </label>
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                  {...register("width")}
                  placeholder="Enter width"
                />
              </div>
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Height
                </label>
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                  {...register("height")}
                  placeholder="Enter height"
                />
              </div>
            </div>

            {/* Stitch Range & Total Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Stitch Range <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.stitchRange ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("stitchRange", { required: "Stitch range is required" })}
                  placeholder="Enter stitch range"
                />
                {errors.stitchRange && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stitchRange.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Total Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${
                    errors.totalPrice ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("totalPrice", { required: "Total Price is required" })}
                  placeholder="Enter Total Price"
                />
                {errors.totalPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.totalPrice.message}
                  </p>
                )}
              </div>
            </div>

            {/* Format Required and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <select
                  className={`border ${
                    errors.formatRequired ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("formatRequired", {
                    required: "Format required is required",
                  })}
                >
                  <option value="">Choose Format</option>
                  <option value="Tajima *.DST">Tajima *.DST</option>
                  <option value="Barudan *.DSB">Barudan *.DSB</option>
                  <option value="Brother *.PES">Brother *.PES</option>
                  <option value="Pfaff *.KSM">Pfaff *.KSM</option>
                  <option value="ZSK *.DSZ">ZSK *.DSZ</option>
                  <option value="Melco *.EXP">Melco *.EXP</option>
                  <option value="Toyota *.10o">Toyota *.10o</option>
                  <option value="Wilcom *.EMB">Wilcom *.EMB</option>
                </select>
                {errors.formatRequired && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.formatRequired.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Time to Complete <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`border ${
                    errors.timeToComplete ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("timeToComplete", {
                    required: "Time to complete is required",
                  })}
                />
                {errors.timeToComplete && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.timeToComplete.message}
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Additional Information
              </label>
              <textarea
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                {...register("additionalInformation")}
                placeholder="Enter any additional information"
                rows="4"
              />
            </div>

            {/* Admin Fields */}
            {user?.role === "admin" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-semibold text-sm pb-1 block text-gray-600">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`border ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full`}
                    {...register("price", { required: "Price is required" })}
                    placeholder="Enter price in USD"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-sm pb-1 block text-gray-600">
                    Stitch Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className={`border ${
                      errors.stitching_count ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full`}
                    {...register("stitching_count", {
                      required: "Stitch count is required",
                      min: { value: 1, message: "Stitch count must be at least 1" },
                    })}
                    placeholder="Enter total stitch count"
                  />
                  {errors.stitching_count && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stitching_count.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-sm pb-1 block text-gray-600">
                    Comment
                  </label>
                  <textarea
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                    {...register("comment", {
                      maxLength: {
                        value: 500,
                        message: "Comment cannot exceed 500 characters",
                      },
                    })}
                    placeholder="Enter any comments for the user"
                    rows="3"
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.comment.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`mt-8 w-full py-2 rounded-lg bg-[#93C572] text-white font-semibold ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
