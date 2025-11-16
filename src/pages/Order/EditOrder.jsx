import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { updateOrder } from "../../Services/Api";
import axios from "axios";

const EditOrder = () => {
  const { state: order } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
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
      designName: order.designName,
      fabricType: order.fabricType,
      fabric: order.fabric,
      noOfColors: order.noOfColors,
      colors: order.colors.join(", "),
      measurement: order.measurement || "inches",
      width: order.width,
      height: order.height,
      // totalPrice: order.totalPrice,
      stitchRange: order.stitchRange,
      formatRequired: order.formatRequired,
      timeToComplete: new Date(order.timeToComplete).toISOString().split("T")[0],
      additionalInformation: order.additionalInformation,
      price: order.price !== undefined && order.price !== null ? order.price : "",
      stitching_count: order.stitching_count !== undefined && order.stitching_count !== null
        ? order.stitching_count
        : "",
      comment: order.comment || "",
      customUserId: order.customUserId || "", // Add customUserId for admin
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const updatedData = {
        designName: data.designName,
        fabricType: data.fabricType,
        fabric: data.fabric,
        noOfColors: Number(data.noOfColors),
        // totalPrice: Number(data.totalPrice),
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
          customUserId: data.customUserId, // Include customUserId for admin
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
  // const handlePriceInput = (e, fieldName = "totalPrice") => {
  //   const value = e.target.value;
  //   if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
  //     setValue(fieldName, value, { shouldValidate: true });
  //   }
  // };

  // Handle text input validation
  const handleTextInput = (e, fieldName, regex = /^[a-zA-Z0-9 ]*$/) => {
    const value = e.target.value;
    if (regex.test(value)) {
      setValue(fieldName, value, { shouldValidate: true });
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
            {/* Customer Name Dropdown (Admin Only) */}
            {user?.role === "admin" && (
              <div className="w-full md:w-1/2 mb-6">
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
            <div className="w-full md:w-1/2 mb-4">
              <label className="font-semibold text-sm pb-1 block text-gray-600">
                Design Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("designName", {
                  required: "Design name is required",
                  minLength: {
                    value: 3,
                    message: "Design name must be at least 3 characters"
                  }
                })}
                value={formValues.designName}
                onChange={(e) => handleTextInput(e, 'designName')}
                className={`border ${errors.designName ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors`}
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
                <select
                  {...register("fabricType", { required: "Fabric type is required" })}
                  value={formValues.fabricType}
                  onChange={(e) => setValue("fabricType", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.fabricType ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
                >
                  <option value="">Select Fabric Type</option>
                  <option value="Soft">Soft</option>
                  <option value="Hard">Hard</option>
                  <option value="Plush">Plush</option>
                </select>
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
                  placeholder="Enter fabric type"
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
                  type="text"
                  {...register("noOfColors", {
                    required: "Number of colors is required",
                    min: { value: 1, message: "At least one color is required" },
                    max: { value: 20, message: "Maximum 20 colors allowed" }
                  })}
                  value={formValues.noOfColors}
                  onChange={(e) => handleNumberInput(e, 'noOfColors', 2)}
                  className={`border ${errors.noOfColors ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
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
                  {...register("colors", {
                    required: "Colors are required",
                    validate: value => {
                      const colors = value.trim().split(",").map(c => c.trim()).filter(c => c !== "");
                      return colors.length >= 1 || "At least one color is required";
                    }
                  })}
                  value={formValues.colors}
                  onChange={(e) => handleTextInput(e, 'colors', /^[a-zA-Z0-9, ]*$/)}
                  className={`border ${errors.colors ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
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

            {/* Width / Height */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Width
                </label>
                <input
                  type="text"
                  {...register("width")}
                  value={formValues.width}
                  onChange={(e) => handleNumberInput(e, 'width')}
                  className={`border ${errors.width ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter width"
                />
                {errors.width && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.width.message}
                  </p>
                )}
              </div>
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Height
                </label>
                <input
                  type="text"
                  {...register("height")}
                  value={formValues.height}
                  onChange={(e) => handleNumberInput(e, 'height')}
                  className={`border ${errors.height ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter height"
                />
                {errors.height && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.height.message}
                  </p>
                )}
              </div>
            </div>

            {/* Stitch Range & Total Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Stitch Range <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("stitchRange", { required: "Stitch range is required" })}
                  value={formValues.stitchRange}
                  onChange={(e) => setValue("stitchRange", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.stitchRange ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b] bg-white`}
                >
                  <option value="">Choose Stitch Range</option>
                  <option value="1000-5000">1000-5000</option>
                  <option value="5000-7000">5000-7000</option>
                  <option value="7000-10000">7000-10000</option>
                  <option value="10000-15000">10000-15000</option>
                  <option value="15000+">15000+</option>
                </select>
                {errors.stitchRange && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stitchRange.message}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Total Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("totalPrice", { 
                    required: "Total Price is required",
                    validate: value => {
                      const num = parseFloat(value);
                      return num > 0 || "Price must be greater than 0";
                    }
                  })}
                  value={formValues.totalPrice}
                  onChange={handlePriceInput}
                  className={`border ${errors.totalPrice ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter Total Price"
                />
                {errors.totalPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.totalPrice.message}
                  </p>
                )}
              </div> */}
            </div>

            {/* Format Required and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Format Required <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("formatRequired", {
                    required: "Format required is required",
                  })}
                  value={formValues.formatRequired}
                  onChange={(e) => setValue("formatRequired", e.target.value, { shouldValidate: true })}
                  className={`border ${errors.formatRequired ? "border-red-500" : "border-gray-300"
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
                  {...register("timeToComplete", {
                    required: "Time to complete is required",
                    validate: value => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || "Date cannot be in the past";
                    }
                  })}
                  value={formValues.timeToComplete}
                  onChange={(e) => setValue("timeToComplete", e.target.value, { shouldValidate: true })}
                  min={new Date().toISOString().split("T")[0]}
                  className={`border ${errors.timeToComplete ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
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
                {...register("additionalInformation", {
                  maxLength: {
                    value: 500,
                    message: "Additional information cannot exceed 500 characters"
                  }
                })}
                value={formValues.additionalInformation}
                onChange={(e) => setValue("additionalInformation", e.target.value, { shouldValidate: true })}
                className={`border ${errors.additionalInformation ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                placeholder="Enter any additional information"
                rows="4"
              />
              {errors.additionalInformation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.additionalInformation.message}
                </p>
              )}
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
                      min: { value: 1, message: "Stitch count must be at least 1" },
                    })}
                    value={formValues.stitching_count}
                    onChange={(e) => handleNumberInput(e, 'stitching_count', 6)}
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

                <div className="md:col-span-2">
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
              </div>
            )}

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
                  Updating order...
                </>
              ) : (
                "Update order"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOrder;