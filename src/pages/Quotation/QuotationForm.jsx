import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createQuotation } from "../../Services/Api";
import { SectionTitle } from "../../components";
import axios from "axios";

const QuotationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const user = localStorage.getItem("user");
  const parsed = JSON.parse(user);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      measurement: "inches",
      customUserId: "",
    },
  });

  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    setToken(tokenData);
    
    // Fetch users if admin
    if (parsed?.role === "admin") {
      fetchUsers(tokenData);
    }
  }, [parsed?.role]);

  const fetchUsers = async (token) => {
    setIsLoadingUsers(true);
    try {
      const response = await axios.get(
        `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/auth/users`,
        { headers: { 'x-auth-token': token } }
      );

      const data = response.data;
      const userData = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
          ? data.users
          : [];

      setUsers(userData);
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        localStorage.clear();
        toast.error('Session Expired. Please log in again.');
        navigate('/login');
        return;
      }

      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users.');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const formValues = watch();

  const handleNumberInput = (e, fieldName, maxDigits = 5) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      if (value === "" || value.length <= maxDigits) {
        setValue(fieldName, value, { shouldValidate: true });
      }
    }
  };

  // Updated: Allow text input for width and height
  const handleTextInput = (e, fieldName) => {
    const value = e.target.value;
    // Allow alphanumeric, spaces, and common measurement symbols
    if (/^[a-zA-Z0-9\s"'-/]*$/.test(value)) {
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

      const colorsArray = data.colors
        .split(" ")
        .map((color) => color.trim())
        .filter(Boolean);

      const quotationData = {
        designName: data.designname.trim(),
        fabricType: data.fabrictype,
        fabric: data.fabric.trim(),
        noOfColors: Number(data.noofcolors),
        colors: colorsArray,
        measurement: data.measurement,
        width: data.width, // Changed from Number() to keep as text
        height: data.height, // Changed from Number() to keep as text
        stitchRange: data.stitch_range.toString(),
        formatRequired: data.format,
        timeToComplete: formatDate(new Date(data.timeTo_complete)),
        additionalInformation: data.additionalinformation?.trim() || "",
        files: data?.files ? data.files[0] : null,
        status: "inProgress",
      };

      // Add customUserId only if admin has selected a customer
      if (parsed.role === "admin" && data.customUserId) {
        quotationData.customUserId = data.customUserId;
      }

      const result = await createQuotation(quotationData, token);
      toast.success(result.message || "Quotation created successfully!");
      navigate("/quotation");
      reset();
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack,
      });
      toast.error(`Failed to create quotation: Please try again`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center bg-[#e6f0df] min-h-screen py-8">
      <div className="p-8 xs:p-0 mx-auto md:w-full max-w-5xl">
        <div className="bg-white border border-gray-200 shadow-lg w-full rounded-lg p-6 md:p-10">
          <SectionTitle title="Quotation Form" path="Home > Quotation Form" />

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

            {/* Customer Name Dropdown (Admin Only) */}
            {parsed?.role === "admin" && (
              <div className="md:col-span-1 w-full md:w-1/2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("customUserId", {
                    required: "Customer selection is required"
                  })}
                  value={formValues.customUserId}
                  onChange={(e) => setValue("customUserId", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.customUserId ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
                  disabled={isLoadingUsers}
                >
                  <option value="">Select Customer</option>
                  {isLoadingUsers ? (
                    <option value="" disabled>Loading customers...</option>
                  ) : (
                    users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.companyname || user.firstname} {user.email ? `(${user.email})` : ''}
                      </option>
                    ))
                  )}
                </select>
                {errors.customUserId && (
                  <p className="text-red-500 text-xs mt-1">{errors.customUserId.message}</p>
                )}
                {users.length === 0 && !isLoadingUsers && (
                  <p className="text-yellow-600 text-xs mt-1">No customers found</p>
                )}
              </div>
            )}

            <div className="md:col-span-1 w-full md:w-1/2">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Design Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("designname", {
                  required: "Design name is required",
                  minLength: {
                    value: 3,
                    message: "Design name must be at least 3 characters",
                  },
                })}
                value={formValues.designname}
                onChange={(e) => handleTextInput(e, "designname")}
                className={`border ${errors.designname ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                placeholder="Enter design name"
              />
              {errors.designname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.designname.message}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fabric Type */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("fabrictype", {
                    required: "Fabric type is required",
                  })}
                  value={formValues.fabrictype}
                  onChange={(e) =>
                    setValue("fabrictype", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  className={`border ${errors.fabrictype ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                >
                  <option value="">Select Fabric Type</option>
                  <option value="Soft">Soft</option>
                  <option value="Hard">Hard</option>
                  <option value="Plush">Plush</option>
                </select>
                {errors.fabrictype && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fabrictype.message}
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
                  {...register("fabric", {
                    required: "Fabric is required",
                    minLength: {
                      value: 2,
                      message: "Fabric must be at least 2 characters",
                    },
                  })}
                  value={formValues.fabric}
                  onChange={(e) => handleTextInput(e, "fabric")}
                  className={`border ${errors.fabric ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                  placeholder="Enter fabric type"
                />
                {errors.fabric && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fabric.message}
                  </p>
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
                    max: { value: 20, message: "Maximum 20 colors allowed" },
                  })}
                  value={formValues.noofcolors}
                  onChange={(e) => handleNumberInput(e, "noofcolors", 2)}
                  className={`border ${errors.noofcolors ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                  placeholder="Enter number of colors"
                />
                {errors.noofcolors && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.noofcolors.message}
                  </p>
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
                    validate: (value) => {
                      const colors = value
                        .trim()
                        .split(" ")
                        .filter((c) => c !== "");
                      return colors.length >= 1 || "At least one color is required";
                    },
                  })}
                  value={formValues.colors}
                  onChange={(e) => handleTextInput(e, "colors")}
                  className={`border ${errors.colors ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                  placeholder="Enter colors separated by spaces"
                />
                {errors.colors && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.colors.message}
                  </p>
                )}
              </div>

              {/* Measurement */}
              <div className="md:col-span-2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Measurement <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("measurement", {
                    required: "Measurement unit is required",
                  })}
                  value={formValues.measurement}
                  onChange={(e) =>
                    setValue("measurement", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  className={`border ${errors.measurement ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                >
                  <option value="inches">Inches</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="other">Other</option>
                </select>
                {errors.measurement && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.measurement.message}
                  </p>
                )}
              </div>

              {/* Width */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Width
                </label>
                <input
                  type="text"
                  {...register("width", {
                    maxLength: {
                      value: 50,
                      message: "Width cannot exceed 50 characters"
                    }
                  })}
                  value={formValues.width}
                  onChange={(e) => handleTextInput(e, "width")}
                  className={`border ${errors.width ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                  placeholder="e.g., 10 inches, 25 cm, medium, large"
                />
                {errors.width && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.width.message}
                  </p>
                )}
              </div>

              {/* Height */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Height
                </label>
                <input
                  type="text"
                  {...register("height", {
                    maxLength: {
                      value: 50,
                      message: "Height cannot exceed 50 characters"
                    }
                  })}
                  value={formValues.height}
                  onChange={(e) => handleTextInput(e, "height")}
                  className={`border ${errors.height ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                  placeholder="e.g., 12 inches, 30 cm, small, extra large"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.height.message}
                  </p>
                )}
              </div>

              {/* Stitch Range */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Stitch Range <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("stitch_range", {
                    required: "Stitch range is required",
                  })}
                  value={formValues.stitch_range}
                  onChange={(e) =>
                    setValue("stitch_range", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  className={`border ${errors.stitch_range ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                >
                  <option value="">Choose Stitch Range</option>
                  <option value="1000-5000">1000-5000</option>
                  <option value="5000-7000">5000-7000</option>
                  <option value="7000-10000">7000-10000</option>
                  <option value="10000-15000">10000-15000</option>
                  <option value="15000+">15000+</option>
                </select>
              </div>

              {/* Format Required */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("format", { required: "Format is required" })}
                  value={formValues.format}
                  onChange={(e) =>
                    setValue("format", e.target.value, { shouldValidate: true })
                  }
                  className={`border ${errors.format ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
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
              </div>

              {/* Time to Complete */}
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Time to Complete Job <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("timeTo_complete", {
                    required: "Completion date is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return (
                        selectedDate >= today || "Date cannot be in the past"
                      );
                    },
                  })}
                  value={formValues.timeTo_complete}
                  onChange={(e) =>
                    setValue("timeTo_complete", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className={`border ${errors.timeTo_complete ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Additional Information
              </label>
              <textarea
                {...register("additionalinformation", {
                  maxLength: {
                    value: 500,
                    message:
                      "Additional information cannot exceed 500 characters",
                  },
                })}
                value={formValues.additionalinformation}
                onChange={(e) =>
                  setValue("additionalinformation", e.target.value, {
                    shouldValidate: true,
                  })
                }
                className={`border ${errors.additionalinformation
                  ? "border-red-500"
                  : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full h-24 focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                placeholder="Enter any additional information or special instructions"
              />
            </div>

            {/* Files */}
            <div className="md:col-span-2">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Files to Send
              </label>
              <input
                type="file"
                multiple
                className={`border ${errors.files ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] text-[#4b4b4b]`}
                {...register("files")}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload reference files (images, documents, etc.)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center md:col-span-2">
              <button
                type="submit"
                className={`bg-[#93C572] hover:bg-[#79a759] text-white font-semibold w-full md:w-1/2 py-3 rounded-lg shadow-md transition-colors flex justify-center items-center ${!isValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
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
                    Creating Quotation...
                  </>
                ) : (
                  <>
                    <span className="inline-block mr-2">Submit Quotation</span>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuotationForm;