import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { updateQuotation } from "../../Services/Api";
import axios from "axios";

const EditQuotation = () => {
  const { state: quotation } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch users for admin
  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role !== "admin") return;
      
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

    fetchUsers();
  }, [navigate, token, user?.role]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm({
    mode: "onChange",
    defaultValues: {
      designname: quotation.designName,
      fabrictype: quotation.fabricType,
      fabric: quotation.fabric,
      noofcolors: quotation.noOfColors,
      colors: quotation.colors.join(" "),
      measurement: quotation.measurement || "inches",
      width: quotation.width,
      height: quotation.height,
      stitch_range: quotation.stitchRange,
      format: quotation.formatRequired,
      timeTo_complete: new Date(quotation.timeToComplete)
        .toISOString()
        .split("T")[0],
      additionalinformation: quotation.additionalInformation,
      price: quotation.price || "",
      stitching_count: quotation.stitching_count || "",
      comment: quotation.comment || "",
      customUserId: quotation.customUserId || "", // Add customUserId for admin
    },
  });

  const formValues = watch();

  const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Handle number input validation
  const handleNumberInput = (e, fieldName, maxDigits = 5) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      if (value === "" || value.length <= maxDigits) {
        setValue(fieldName, value, { shouldValidate: true });
      }
    }
  };

  // Handle price input validation
  const handlePriceInput = (e, fieldName = "price") => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
      setValue(fieldName, value, { shouldValidate: true });
    }
  };

  // Handle text input validation
  const handleTextInput = (e, fieldName, regex = /^[a-zA-Z0-9 ]*$/) => {
    const value = e.target.value;
    if (regex.test(value)) {
      setValue(fieldName, value, { shouldValidate: true });
    }
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
        measurement: data.measurement,
        width: Number(data.width),
        height: Number(data.height),
        stitchRange: data.stitch_range,
        formatRequired: data.format,
        timeToComplete: formatDate(new Date(data.timeTo_complete)),
        additionalInformation: data.additionalinformation,
        ...(user?.role === "admin" && {
          price: data.price,
          stitching_count: Number(data.stitching_count),
          comment: data.comment,
          customUserId: data.customUserId, 
        }),
      };

      const result = await updateQuotation(quotation._id, updatedQuotation, token);
      toast.success(result.message || "Quotation updated successfully!");

      if (user?.role === "admin") navigate("/admin/quotation");
      else if (user?.role === "user") navigate("/quotation");
      else {
        toast.error("You are not authorized to perform this action.");
        navigate("/");
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
          <h2 className="text-3xl text-center text-[#93C572] font-bold mb-6">
            Edit Quotation
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Customer Name Dropdown (Admin Only) */}
            {user?.role === "admin" && (
              <div className="mb-6">
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

            {/* Design Name */}
            <div className="mb-6">
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
                className={`border ${errors.designname ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors`}
                placeholder="Enter design name"
              />
              {errors.designname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.designname.message}
                </p>
              )}
            </div>

            {/* Fabric Type & Fabric */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("fabrictype", {
                    required: "Fabric type is required",
                  })}
                  value={formValues.fabrictype}
                  onChange={(e) => setValue("fabrictype", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.fabrictype ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
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
                  className={`border ${errors.fabric ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter fabric"
                />
                {errors.fabric && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fabric.message}
                  </p>
                )}
              </div>
            </div>

            {/* Colors & Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Number of Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("noofcolors", {
                    required: "Number of colors is required",
                    min: { 
                      value: 1, 
                      message: "At least one color is required" 
                    },
                    max: { 
                      value: 20, 
                      message: "Maximum 20 colors allowed" 
                    }
                  })}
                  value={formValues.noofcolors}
                  onChange={(e) => handleNumberInput(e, "noofcolors", 2)}
                  className={`border ${errors.noofcolors ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter number of colors"
                />
                {errors.noofcolors && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.noofcolors.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Colors <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("colors", { 
                    required: "Colors are required",
                    validate: (value) => {
                      const colors = value.trim().split(" ").filter(c => c !== "");
                      return colors.length >= 1 || "At least one color is required";
                    }
                  })}
                  value={formValues.colors}
                  onChange={(e) => handleTextInput(e, "colors")}
                  className={`border ${errors.colors ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter colors separated by spaces"
                />
                {errors.colors && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.colors.message}
                  </p>
                )}
              </div>
            </div>

            {/* Measurement */}
            <div className="mt-6">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Measurement <span className="text-red-500">*</span>
              </label>
              <select
                {...register("measurement", {
                  required: "Measurement unit is required",
                })}
                value={formValues.measurement}
                onChange={(e) => setValue("measurement", e.target.value, { shouldValidate: true })}
                className={`border ${errors.measurement ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
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

            {/* Width & Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Width
                </label>
                <input
                  type="text"
                  {...register("width")}
                  value={formValues.width}
                  onChange={(e) => handleNumberInput(e, "width")}
                  className={`border ${errors.width ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter width"
                />
              </div>

              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Height
                </label>
                <input
                  type="text"
                  {...register("height")}
                  value={formValues.height}
                  onChange={(e) => handleNumberInput(e, "height")}
                  className={`border ${errors.height ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter height"
                />
              </div>
            </div>

            {/* Stitch Range & Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Stitch Range <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("stitch_range", {
                    required: "Stitch range is required",
                  })}
                  value={formValues.stitch_range}
                  onChange={(e) => setValue("stitch_range", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.stitch_range ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
                >
                  <option value="">Choose Stitch Range</option>
                  <option value="1000-5000">1000-5000</option>
                  <option value="5000-7000">5000-7000</option>
                  <option value="7000-10000">7000-10000</option>
                  <option value="10000-15000">10000-15000</option>
                  <option value="15000+">15000+</option>
                </select>
                {errors.stitch_range && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stitch_range.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("format", {
                    required: "Format required is required",
                  })}
                  value={formValues.format}
                  onChange={(e) => setValue("format", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.format ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
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
                {errors.format && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.format.message}
                  </p>
                )}
              </div>
            </div>

            {/* Time to Complete */}
            <div className="mt-6">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Time to Complete <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register("timeTo_complete", {
                  required: "Time to complete is required",
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate >= today || "Date cannot be in the past";
                  }
                })}
                value={formValues.timeTo_complete}
                onChange={(e) => setValue("timeTo_complete", e.target.value, { shouldValidate: true })}
                min={new Date().toISOString().split("T")[0]}
                className={`border ${errors.timeTo_complete ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
              />
              {errors.timeTo_complete && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.timeTo_complete.message}
                </p>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-6">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Additional Information
              </label>
              <textarea
                {...register("additionalinformation", {
                  maxLength: {
                    value: 500,
                    message: "Additional information cannot exceed 500 characters",
                  },
                })}
                value={formValues.additionalinformation}
                onChange={(e) => setValue("additionalinformation", e.target.value, { shouldValidate: true })}
                className={`border ${errors.additionalinformation ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                placeholder="Enter any additional information"
                rows="4"
              />
              {errors.additionalinformation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.additionalinformation.message}
                </p>
              )}
            </div>

            {/* Admin Section */}
            {user?.role === "admin" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="font-semibold text-sm pb-1 block text-gray-600">
                      Price ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("price", { 
                        required: "Price is required",
                        validate: value => {
                          const num = parseFloat(value);
                          return num > 0 || "Price must be greater than 0";
                        }
                      })}
                      value={formValues.price}
                      onChange={(e) => handlePriceInput(e, 'price')}
                      className={`border ${errors.price ? "border-red-500" : "border-gray-300"
                        } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
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
                      type="text"
                      {...register("stitching_count", {
                        required: "Stitch count is required",
                        min: {
                          value: 1,
                          message: "Stitch count must be at least 1",
                        },
                      })}
                      value={formValues.stitching_count}
                      onChange={(e) => handleNumberInput(e, "stitching_count", 6)}
                      className={`border ${errors.stitching_count ? "border-red-500" : "border-gray-300"
                        } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                      placeholder="Enter total stitch count"
                    />
                    {errors.stitching_count && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.stitching_count.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="font-semibold text-sm pb-1 block text-gray-600">
                    Comment
                  </label>
                  <textarea
                    {...register("comment", {
                      maxLength: {
                        value: 500,
                        message: "Comment cannot exceed 500 characters",
                      },
                    })}
                    value={formValues.comment}
                    onChange={(e) => setValue("comment", e.target.value, { shouldValidate: true })}
                    className={`border ${errors.comment ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                    placeholder="Enter any comments for the user"
                    rows="3"
                  />
                  {errors.comment && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.comment.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`mt-8 w-full py-2 rounded-lg bg-[#93C572] text-white font-semibold flex justify-center items-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || !isValid}
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
                  Updating Quotation...
                </>
              ) : (
                "Update Quotation"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuotation;