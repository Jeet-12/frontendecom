import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../Services/Api";
import { SectionTitle } from "../../components";
import axios from "axios";

const OrderForm = () => {
  const location = useLocation();
  const quotation = location.state ?? {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const user = localStorage.getItem("user");
  const parsed = JSON.parse(user);

  // Valid file types
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
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

    if (parsed?.role === "admin") {
      fetchUsers();
    }
  }, [navigate, parsed?.role]);

  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      designName: quotation.designName || "",
      fabricType: quotation.fabricType || "",
      fabric: quotation.fabric || "",
      noOfColors: quotation.noOfColors || "",
      colors: quotation.colors?.join(" ") || "",
      measurement: quotation.measurement || "inches",
      width: quotation.width || "",
      height: quotation.height || "",
      stitchRange: quotation.stitchRange || "",
      formatRequired: quotation.formatRequired || "",
      timeToComplete: quotation.timeToComplete || new Date().toISOString().split("T")[0],
      additionalInformation: quotation.additionalInformation || "",
      totalPrice: quotation.totalPrice || "",
      quantity: quotation.quantity || "1",
      customUserId: quotation.customUserId || "",
    }
  });

  const formValues = watch();

  const handleNumberInput = (e, fieldName, maxDigits = 5) => {
    const value = e.target.value;
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      if (value === "" || value.length <= maxDigits) {
        setValue(fieldName, value, { shouldValidate: true });
      }
    }
  };

  const handlePriceInput = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
      setValue("totalPrice", value, { shouldValidate: true });
    }
  };

  const handleTextInput = (e, fieldName, regex = /^[a-zA-Z0-9 ]*$/) => {
    const value = e.target.value;
    if (regex.test(value)) {
      setValue(fieldName, value, { shouldValidate: true });
    }
  };

  // Handle file upload
  const handleFilesUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Filter valid files
    const validFiles = selectedFiles.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPEG, PNG, PDF, DOC are allowed.`);
        return false;
      }

      const maxSize = 4 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 4MB.`);
        return false;
      }

      return true;
    });

    // Add to existing files (limit to 4 files total)
    setFiles(prev => {
      const newFiles = [...prev, ...validFiles].slice(0, 4);
      if (newFiles.length > 4) {
        toast.warning("Maximum 4 files allowed. Only first 4 files will be uploaded.");
      }
      return newFiles;
    });
  };

  // Remove file
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData?.id) {
        toast.error("User information not found. Please login again.");
        navigate("/login");
        return;
      }

      const token = localStorage.getItem("token");

      // Format date to MM/DD/YYYY
      const formatDateToMMDDYYYY = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${month}/${day}/${year}`;
      };

      // Create FormData object
      const formData = new FormData();

      // Add all form fields to FormData
      formData.append('user', userData.id);
      formData.append('designName', data.designName.trim());
      formData.append('fabricType', data.fabricType);
      formData.append('fabric', data.fabric.trim());
      formData.append('noOfColors', data.noOfColors);
      formData.append('colors', data.colors.split(' ').map(color => color.trim()).filter(Boolean).join(','));
      formData.append('measurement', data.measurement);
      formData.append('width', data.width);
      formData.append('height', data.height);
      formData.append('stitchRange', data.stitchRange);
      formData.append('formatRequired', data.formatRequired);
      formData.append('timeToComplete', formatDateToMMDDYYYY(data.timeToComplete));
      formData.append('additionalInformation', data.additionalInformation.trim());
      formData.append('totalPrice', data.totalPrice || "0");
      formData.append('status', "inprogress");

      // Add customUserId only if admin has selected a customer
      if (parsed.role === "admin" && data.customUserId) {
        formData.append('customUserId', data.customUserId);
      }

      // Add files
      files.forEach((file, index) => {
        formData.append('files', file);
      });




      const response = await axios.post(
        'http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/order/create',
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(response.data.message || "Order created successfully!");
      setTimeout(() => {
        if (parsed?.role === "admin") {
          navigate("/admin/order");
        } else {
          navigate("/order");
        }
      }, 1000);
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
      toast.error(`Failed to create order: ${err.response?.data?.message || "Please try again"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center bg-[#e6f0df] min-h-screen py-4 px-4 sm:py-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-white border border-gray-200 shadow-lg w-full rounded-lg p-3 sm:p-4 md:p-6">
          <SectionTitle title={`Order Form`} path={`Home > Order Form`} />
          <form onSubmit={handleSubmit(onSubmit)} noValidate encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

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

              {/* Design Name */}
              <div className="md:col-span-1 w-full md:w-1/2">
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
                  <p className="text-red-500 text-xs mt-1">{errors.designName.message}</p>
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
                    <p className="text-red-500 text-xs mt-1">{errors.fabricType.message}</p>
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
                    <p className="text-red-500 text-xs mt-1">{errors.fabric.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Colors */}
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
                    <p className="text-red-500 text-xs mt-1">{errors.noOfColors.message}</p>
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
                    className={`border ${errors.colors ? "border-red-500" : "border-gray-300"
                      } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                    placeholder="Enter colors separated by spaces"
                  />
                  {errors.colors && (
                    <p className="text-red-500 text-xs mt-1">{errors.colors.message}</p>
                  )}
                </div>
              </div>

              {/* Measurement */}
              <div className="md:col-span-1 w-full md:w-1/2">
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
                  <p className="text-red-500 text-xs mt-1">{errors.measurement.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Width */}
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
                    <p className="text-red-500 text-xs mt-1">{errors.width.message}</p>
                  )}
                </div>

                {/* Height */}
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
                    <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stitch Range */}
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
                    <p className="text-red-500 text-xs mt-1">{errors.stitchRange.message}</p>
                  )}
                </div>

                {/* Format Required */}
                <div>
                  <label className="font-semibold text-sm pb-1 block text-gray-600">
                    Format Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("formatRequired", { required: "Format is required" })}
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
                    <p className="text-red-500 text-xs mt-1">{errors.formatRequired.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time to Complete Job */}
                <div>
                  <label className="font-semibold text-sm pb-1 block text-gray-600">
                    Time to Complete Job <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("timeToComplete", {
                      required: "Completion date is required",
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
                    <p className="text-red-500 text-xs mt-1">{errors.timeToComplete.message}</p>
                  )}
                </div>

                {/* Total Price */}
                {parsed?.role === "admin" && (
                  <div>
                    <label className="font-semibold text-sm pb-1 block text-gray-600">
                      Total Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("totalPrice", {
                        required: "Total price is required",
                        validate: value => {
                          const num = parseFloat(value);
                          return num > 0 || "Price must be greater than 0";
                        }
                      })}
                      value={formValues.totalPrice}
                      onChange={handlePriceInput}
                      className={`border ${errors.totalPrice ? "border-red-500" : "border-gray-300"
                        } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                      placeholder="Enter total price"
                    />
                    {errors.totalPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.totalPrice.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity */}
              {/* <div>
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("quantity", {
                    required: "Quantity is required",
                    min: { value: 1, message: "Quantity must be at least 1" }
                  })}
                  value={formValues.quantity}
                  onChange={(e) => handleNumberInput(e, 'quantity', 5)}
                  className={`border ${errors.quantity ? "border-red-500" : "border-gray-300"
                    } rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>
                )}
              </div> */}

              {/* File Upload */}
              <div className="md:col-span-2">
                <label className="font-semibold text-sm pb-1 block text-gray-600">
                  Upload Files
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={handleFilesUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#93C572] file:text-white hover:file:bg-[#79a759]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPEG, PNG, PDF, DOC, DOCX (Max 4MB per file, max 4 files)
                  </p>

                  {/* File preview */}
                  {files.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Uploaded files ({files.length}/4):
                      </p>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="md:col-span-2">
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
                    } rounded-lg px-3 py-2 text-sm w-full h-24 focus:outline-none focus:ring-2 focus:ring-[#AFE1AF] focus:border-[#93C572] transition-colors text-[#4b4b4b]`}
                  placeholder="Enter any additional information"
                />
                {errors.additionalInformation && (
                  <p className="text-red-500 text-xs mt-1">{errors.additionalInformation.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-[#93C572] hover:bg-[#79a759] text-white font-semibold w-full py-2 rounded-lg shadow-md transition-colors flex justify-center items-center mt-6 ${!isValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
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
                  <span className="inline-block mr-2">Create Order</span>
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

export default OrderForm;