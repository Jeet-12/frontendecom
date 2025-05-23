import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchWithAuth } from "../Services/fetchWithAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const emailRegex = /^\S+@\S+\.\S+$/;

  useEffect(() => {
    if (emailTouched) {
      if (!email.trim()) {
        setEmailError("Please enter an email.");
      } else if (!emailRegex.test(email)) {
        setEmailError("Enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
  }, [email, emailTouched]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!emailError && email.trim()) {
      setLoading(true);
      try {
        const { data } = await fetchWithAuth(
          `http://quickdigitizing-api.ap-south-1.elasticbeanstalk.com/api/auth/forgot-password`,
          { email }
        );
        localStorage.clear();
        toast.success("Password reset link sent to your email.");
        navigate("/login");
      } catch (error) {
        const status = err.response?.status;

        if (status === 401) {
          localStorage.clear();
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }
        toast.error(
          
          error?.response?.data?.message || "Failed to send reset link."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg"
            alt="Forgot Password"
            className="w-40"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={`w-full px-4 py-2 border rounded-lg ${
                emailTouched && emailError
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="you@company.com"
            />
            {emailTouched && emailError && (
              <p className="text-red-500 text-xs">{emailError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!email || !!emailError || loading}
            className={`w-full px-4 py-2 rounded-lg text-white font-medium ${
              !email || !!emailError || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
