import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { updateQuotation } from "../../Services/Api"; // Your API call for updating quotations

const EditQuotation = () => {
  const { state: quotation } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      designname: quotation.designName,
      fabrictype: quotation.fabricType,
      fabric: quotation.fabric,
      noofcolors: quotation.noOfColors,
      colors: quotation.colors.join(" "),
      width: quotation.width,
      height: quotation.height,
      stitch_range: quotation.stitchRange,
      format: quotation.formatRequired,
      timeTo_complete: new Date(quotation.timeToComplete).toISOString().split("T")[0],
      additionalinformation: quotation.additionalInformation,
      quantity: quotation.quantity, 
       price: quotation.price || "",
      stitching_count: quotation.stitching_count || "",
      comment: quotation.comment || "",
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
      const updatedQuotation = {
        designName: data.designname,
        fabricType: data.fabrictype,
        fabric: data.fabric,
        noOfColors: Number(data.noofcolors),
        colors: data.colors.trim().split(" "),
        width: Number(data.width),
        height: Number(data.height),
        stitchRange: data.stitch_range,
        formatRequired: data.format,
        timeToComplete: formatDate(new Date(data.timeTo_complete)),
        additionalInformation: data.additionalinformation,
        quantity: Number(data.quantity),
         ...(user?.role === 'admin' && {
          price: Number(data.price),
          stitching_count: Number(data.stitching_count),
          comment: data.comment,
        }),
      };

      const user = JSON.parse(localStorage.getItem("user"));

      if (user?.role === 'admin') {
        const result = await updateQuotation(quotation._id, updatedQuotation, token);
        toast.success(result.message || "Quotation updated successfully!");
        navigate(`/admin/quotation`);
      } else if (user?.role === 'user') {
        const result = await updateQuotation(quotation._id, updatedQuotation, token);
        toast.success(result.message || "Quotation updated successfully!");
        navigate(`/quotation`);
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
      <div className="p-4 sm:p-6 lg:p-8 mx-auto md:w-full max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-lg w-full rounded-lg p-6">
          <h2 className="text-3xl text-center text-[#93C572] font-bold mb-6">Edit Quotation</h2>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Design Name */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Design Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`border ${errors.designname ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("designname", { required: "Design name is required" })}
                  placeholder="Enter design name"
                />
                {errors.designname && <p className="text-red-500 text-xs mt-1">{errors.designname.message}</p>}
              </div>

              {/* Fabric Type */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <select
                  className={`border ${errors.fabrictype ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("fabrictype", { required: "Fabric type is required" })}
                >
                  <option value="">Select Fabric Type</option>
                  <option value="Soft">Soft</option>
                  <option value="Hard">Hard</option>
                  <option value="Plush">Plush</option>
                </select>
                {errors.fabrictype && <p className="text-red-500 text-xs mt-1">{errors.fabrictype.message}</p>}
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
                  className={`border ${errors.noofcolors ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("noofcolors", { required: "Number of colors is required", min: 1 })}
                  placeholder="Enter number of colors"
                />
                {errors.noofcolors && <p className="text-red-500 text-xs mt-1">{errors.noofcolors.message}</p>}
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
                  placeholder="Enter colors separated by spaces"
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
                <select
                  className={`border ${errors.stitch_range ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("stitch_range", { required: "Stitch range is required" })}
                >
                  <option value="">Choose Stitch Range</option>
                  <option value="1000-5000">1000-5000</option>
                  <option value="5000-7000">5000-7000</option>
                  <option value="7000-10000">7000-10000</option>
                  <option value="10000-15000">10000-15000</option>
                  <option value="15000+">15000+</option>
                </select>
                {errors.stitch_range && <p className="text-red-500 text-xs mt-1">{errors.stitch_range.message}</p>}
              </div>

              {/* Format Required */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <select
                  className={`border ${errors.format ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("format", { required: "Format required is required" })}
                >
                  <option value="">Choose Format</option>
                  <option value="Tajima *.DST">Tajima *.DST</option>
                  <option value="Barudan *.DSB">Barudan *.DSB</option>
                  <option value="Brother *.PES">Brother *.PES</option>
                  <option value="Pfaff *.KSM">Pfaff *.KSM</option>
                  <option value="ZSK *.DSZ">ZSK *.DSZ</option>
                  <option value="Melco *.EXP">Melco *.EXP</option>
                  <option value="Toyota *.10o">Toyota *.10o</option>
                </select>
                {errors.format && <p className="text-red-500 text-xs mt-1">{errors.format.message}</p>}
              </div>

              {/* Time to Complete */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Time to Complete <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`border ${errors.timeTo_complete ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("timeTo_complete", { required: "Time to complete is required" })}
                />
                {errors.timeTo_complete && <p className="text-red-500 text-xs mt-1">{errors.timeTo_complete.message}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className={`border ${errors.quantity ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("quantity", { required: "Quantity is required", min: 1 })}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Additional Information
                </label>
                <textarea
                  className={`border ${errors.additionalinformation ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                  {...register("additionalinformation")}
                  placeholder="Enter any additional information"
                  rows="4"
                />
                {errors.additionalinformation && <p className="text-red-500 text-xs mt-1">{errors.additionalinformation.message}</p>}
              </div>


              {user?.role === 'admin' && (
                <>
                  {/* Price */}
                  <div>
                    <label className="font-semibold text-sm pb-1 block text-gray-600">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className={`border ${errors.price ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0.01, message: "Price must be greater than 0" }
                      })}
                      placeholder="Enter price in USD"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                  </div>

                  {/* Stitch Count */}
                  <div>
                    <label className="font-semibold text-sm pb-1 block text-gray-600">
                      Stitch Count <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      className={`border ${errors.stitching_count ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                      {...register("stitching_count", {
                        required: "Stitch count is required",
                        min: { value: 1, message: "Stitch count must be at least 1" }
                      })}
                      placeholder="Enter total stitch count"
                    />
                    {errors.stitching_count && <p className="text-red-500 text-xs mt-1">{errors.stitching_count.message}</p>}
                  </div>

                  {/* Admin Comment */}
                  <div className="md:col-span-2">
                    <label className="font-semibold text-sm pb-1 block text-gray-600">
                     Comment
                    </label>
                    <textarea
                      className={`border ${errors.comment ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 text-sm w-full`}
                      {...register("comment", {
                        maxLength: {
                          value: 500,
                          message: "Comment cannot exceed 500 characters"
                        }
                      })}
                      placeholder="Enter any comments for the user"
                      rows="3"
                    />
                    {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
                  </div>
                </>
              )}
            </div>
            <button
              type="submit"
              className={`mt-6 w-full py-2 rounded-lg bg-[#93C572] text-white font-semibold ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            // disabled={isLoading || !isValid} 
            >
              {isLoading ? "Updating Quotation..." : "Update Quotation"}
            </button>
          </form>
        </div>
      </div>
    </div >
  );
};

export default EditQuotation;