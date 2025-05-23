import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createQuotation } from "../../Services/Api";
import { SectionTitle } from "../../components";

const QuotationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const { register, handleSubmit, watch, reset, formState: { errors, isValid }, setValue } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    setToken(tokenData);
  }, []);

  const formValues = watch();

  const handleNumberInput = (e, fieldName, maxDigits = 5) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      if (value === "" || value.length <= maxDigits) {
        setValue(fieldName, value, { shouldValidate: true });
      }
    }
  };

  const handleTextInput = (e, fieldName, regex = /^[a-zA-Z0-9 ]*$/) => {
    const value = e.target.value;
    if (regex.test(value)) {
      setValue(fieldName, value, { shouldValidate: true });
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
      };

      const colorsArray = data.colors.split(' ').map(color => color.trim()).filter(Boolean);

      const quotationData = {
        designName: data.designname.trim(),
        fabricType: data.fabrictype,
        fabric: data.fabric.trim(),
        noOfColors: Number(data.noofcolors),
        colors: colorsArray,
        width: Number(data.width),
        height: Number(data.height),
        stitchRange: data.stitch_range.toString(),
        formatRequired: data.format,
        timeToComplete: formatDate(new Date(data.timeTo_complete)),
        additionalInformation: data.additionalinformation?.trim() || "",
        quantity: Number(data.quantity),
        files: data?.files ? data.files[0] : null,
        status: "inProgress",
      };

      const result = await createQuotation(quotationData, token);
      toast.success(result.message || "Quotation created successfully!");
      navigate("/quotation");
      reset();
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      toast.error(`Failed to create quotation: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center bg-[#e6f0df] min-h-screen py-8">
      <div className="p-8 xs:p-0 mx-auto md:w-full max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-lg w-full rounded-lg p-4">
          <SectionTitle title={`Quotation Form`} path={`Home > Quotation Form`} />
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Design Name */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Design Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("designname", { 
                    required: "Design name is required",
                    minLength: {
                      value: 3,
                      message: "Design name must be at least 3 characters"
                    }
                  })}
                  value={formValues.designname}
                  onChange={(e) => handleTextInput(e, 'designname')}
                  className={`border ${
                    errors.designname ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter design name"
                />
                {errors.designname && (
                  <p className="text-red-500 text-xs mt-1">{errors.designname.message}</p>
                )}
              </div>

              {/* Fabric Type */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("fabrictype", { required: "Fabric type is required" })}
                  value={formValues.fabrictype}
                  onChange={(e) => setValue("fabrictype", e.target.value, { shouldValidate: true })}
                  className={`border ${
                    errors.fabrictype ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]  bg-white`}
                >
                  <option value="">Select Fabric Type</option>
                  <option value="Soft">Soft</option>
                  <option value="Hard">Hard</option>
                  <option value="Plush">Plush</option>
                </select>
                {errors.fabrictype && (
                  <p className="text-red-500 text-xs mt-1">{errors.fabrictype.message}</p>
                )}
              </div>

              {/* Fabric */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fabric", { 
                    required: "Fabric is required",
                    minLength: {
                      value: 2,
                      message: "Fabric must be at least 2 characters"
                    }
                  })}
                  value={formValues.fabric}
                  onChange={(e) => handleTextInput(e, 'fabric')}
                  className={`border ${
                    errors.fabric ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter fabric type"
                />
                {errors.fabric && (
                  <p className="text-red-500 text-xs mt-1">{errors.fabric.message}</p>
                )}
              </div>

              {/* Number of Colors */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Number of Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("noofcolors", {
                    required: "Number of colors is required",
                    min: { value: 1, message: "At least one color is required" },
                    max: { value: 20, message: "Maximum 20 colors allowed" }
                  })}
                  value={formValues.noofcolors}
                  onChange={(e) => handleNumberInput(e, 'noofcolors', 2)}
                  className={`border ${
                    errors.noofcolors ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter number of colors"
                />
                {errors.noofcolors && (
                  <p className="text-red-500 text-xs mt-1">{errors.noofcolors.message}</p>
                )}
              </div>

              {/* Colors */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("colors", { 
                    required: "Colors are required",
                    validate: value => {
                      const colors = value.trim().split(" ").filter(c => c !== "");
                      return colors.length >= 1 || "At least one color is required";
                    }
                  })}
                  value={formValues.colors}
                  onChange={(e) => handleTextInput(e, 'colors')}
                  className={`border ${
                    errors.colors ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter colors separated by spaces"
                />
                {errors.colors && (
                  <p className="text-red-500 text-xs mt-1">{errors.colors.message}</p>
                )}
              </div>

              {/* Width */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Width (in inches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("width", { 
                    required: "Width is required",
                    min: { value: 1, message: "Width must be at least 1 inch" },
                    max: { value: 100, message: "Maximum width is 100 inches" }
                  })}
                  value={formValues.width}
                  onChange={(e) => handleNumberInput(e, 'width')}
                  className={`border ${
                    errors.width ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter width"
                />
                {errors.width && (
                  <p className="text-red-500 text-xs mt-1">{errors.width.message}</p>
                )}
              </div>

              {/* Height */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Height (in inches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("height", { 
                    required: "Height is required",
                    min: { value: 1, message: "Height must be at least 1 inch" },
                    max: { value: 100, message: "Maximum height is 100 inches" }
                  })}
                  value={formValues.height}
                  onChange={(e) => handleNumberInput(e, 'height')}
                  className={`border ${
                    errors.height ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter height"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>
                )}
              </div>

              {/* Stitch Range */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Stitch Range <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("stitch_range", { required: "Stitch range is required" })}
                  value={formValues.stitch_range}
                  onChange={(e) => setValue("stitch_range", e.target.value, { shouldValidate: true })}
                  className={`border ${
                    errors.stitch_range ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]  bg-white`}
                >
                  <option value="">Choose Stitch Range</option>
                  <option value="1000-5000">1000-5000</option>
                  <option value="5000-7000">5000-7000</option>
                  <option value="7000-10000">7000-10000</option>
                  <option value="10000-15000">10000-15000</option>
                  <option value="15000+">15000+</option>
                </select>
                {errors.stitch_range && (
                  <p className="text-red-500 text-xs mt-1">{errors.stitch_range.message}</p>
                )}
              </div>

              {/* Format Required */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("format", { required: "Format is required" })}
                  value={formValues.format}
                  onChange={(e) => setValue("format", e.target.value, { shouldValidate: true })}
                  className={`border ${
                    errors.format ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]  bg-white`}
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
                {errors.format && (
                  <p className="text-red-500 text-xs mt-1">{errors.format.message}</p>
                )}
              </div>

              {/* Time to Complete Job */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Time to Complete Job <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("timeTo_complete", { 
                    required: "Completion date is required",
                    validate: value => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || "Date cannot be in the past";
                    }
                  })}
                  value={formValues.timeTo_complete}
                  onChange={(e) => setValue("timeTo_complete", e.target.value, { shouldValidate: true })}
                  min={new Date().toISOString().split("T")[0]}
                  className={`border ${
                    errors.timeTo_complete ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                />
                {errors.timeTo_complete && (
                  <p className="text-red-500 text-xs mt-1">{errors.timeTo_complete.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" },
                    max: { value: 99999, message: "Maximum quantity is 99999" }
                  })}
                  value={formValues.quantity}
                  onChange={(e) => handleNumberInput(e, 'quantity', 5)}
                  className={`border ${
                    errors.quantity ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
                )}
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Additional Information
                </label>
                <textarea
                  {...register("additionalinformation", {
                    maxLength: {
                      value: 500,
                      message: "Additional information cannot exceed 500 characters"
                    }
                  })}
                  value={formValues.additionalinformation}
                  onChange={(e) => setValue("additionalinformation", e.target.value, { shouldValidate: true })}
                  className={`border ${
                    errors.additionalinformation ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full h-24 focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter any additional information"
                />
                {errors.additionalinformation && (
                  <p className="text-red-500 text-xs mt-1">{errors.additionalinformation.message}</p>
                )}
              </div>

              {/* Files to Send */}
              <div className="md:col-span-2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Files to Send
                </label>
                <input
                  type="file"
                  multiple
                  className={`border ${
                    errors.files ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  {...register("files")}
                />
                {errors.files && (
                  <p className="text-red-500 text-xs mt-1">{errors.files.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-[#93C572] hover:bg-[#79a759] text-white font-semibold w-full py-2 rounded-lg shadow-md transition-colors flex justify-center items-center mt-6 ${
                !isValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                <>
                  <span className="inline-block mr-2">Submit</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4 inline-block"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;