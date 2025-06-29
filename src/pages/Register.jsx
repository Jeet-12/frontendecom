import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { registerUser } from "../Services/Api";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // console.log(data);
      const result = await registerUser(data);
      // console.log(result);
      toast.success(result.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#93C572]">
            Create Your Account
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("firstname", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Must be at least 2 characters" },
                    pattern: { value: /^[A-Za-z]+$/, message: "Only letters allowed" }
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.firstname ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your first name"
                />
                {errors.firstname && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.firstname.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("lastname", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Must be at least 2 characters" },
                    pattern: { value: /^[A-Za-z]+$/, message: "Only letters allowed" }
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.lastname ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your last name"
                />
                {errors.lastname && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.lastname.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.email ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Company Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  {...register("companyname", {
                    pattern: { value: /^[A-Za-z0-9\s]+$/, message: "No special characters allowed" }
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ring-gray-200
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your company name (optional)"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("address", {
                    required: "Address is required",
                    minLength: { value: 5, message: "Address must be at least 5 characters" }
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.address ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your address"
                />
                {errors.address && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.address.message}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("state", {
                    required: "State is required",
                    pattern: { value: /^[A-Za-z0-9\s]+$/, message: "No special characters allowed" }
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.state ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your state"
                />
                {errors.state && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>

              {/* Zip Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("zipcode", {
                    required: "ZIP code is required",
        
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.zipcode ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your ZIP code"
                />
                {errors.zipcode && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.zipcode.message}</p>
                )}
              </div>

              {/* Country */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("country", {
                    required: "Country is required",
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.country ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                  `}
                >
                  <option value="">Select your country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  {/* Add more countries as needed */}
                </select>
                {errors.country && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.country.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="off"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Min 8 chars, 1 uppercase, 1 number, 1 special character"
                    }
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.password ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  {...register("confirmpassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className={`
                    w-full px-4 py-3
                    bg-white/50
                    rounded-xl
                    border-0
                    text-gray-900
                    ring-1 ring-inset ${errors.confirmpassword ? 'ring-red-300' : 'ring-gray-200'}
                    focus:ring-2 focus:ring-inset focus:ring-blue-500
                    placeholder:text-gray-400
                  `}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.confirmpassword.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={!isValid}
                className={`
                  w-full px-6 py-3
                  rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  flex items-center justify-center
                  ${!isValid
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                  }
                  shadow-lg shadow-blue-500/20
                `}
              >
                <span>Create Account</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

              {/* Login Link */}
              <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
