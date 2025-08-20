import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser as loginUserAction } from "../features/auth/authSlice";
import { decodeToken } from "../features/utils/auth";
import { login } from "../Services/Api";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submissionError, setSubmissionError] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const emailRegex = /^\S+@\S+\.\S+$/;

  useEffect(() => {
    if (emailTouched) {
      if (!email.trim()) {
        setEmailError("Please enter an email.");
      } else if (!emailRegex.test(email)) {
        setEmailError("Enter a valid email.");
      } else {
        setEmailError("");
      }
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (passwordTouched) {
      if (!password.trim()) {
        setPasswordError("Please enter a password.");
      } else if (password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
      } else {
        setPasswordError("");
      }
    }
  }, [password, passwordTouched]);

  const isValidate = () => {
    setEmailTouched(true);
    setPasswordTouched(true);

    let isValid = true;

    if (!email.trim() || !emailRegex.test(email)) {
      isValid = false;
    }

    if (!password.trim() || password.length < 6) {
      isValid = false;
    }

    return isValid;
  };

  const proceedLogin = async (e) => {
    e.preventDefault();
    setSubmissionError(null);

    if (isValidate()) {
      try {
        setIsLoading(true);
        const response = await login({ email, password });

        if (response.token) {
          const decoded = decodeToken(response.token);
          localStorage.setItem('user', JSON.stringify(decoded.user));
          localStorage.setItem('token', response.token);
          dispatch(loginUserAction(decoded));

          if (decoded.user.role?.toLowerCase() === "admin") {
            navigate('/admin/quotation');
            toast.success('Logged in as Admin!');
          } else {
            navigate('/quotation');
          }
        } else {
          throw new Error(response.message || 'Invalid credentials');
        }
      } catch (err) {
        const errorMessage = err?.response?.data?.message || err?.message || 'Something went wrong! Please try again.';
        setSubmissionError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8f9fa]">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl mt-8 mb-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Left Side - Plain Background */}
            <div className="lg:w-1/2 relative" style={{ backgroundColor: 'rgb(147, 197, 114)' }}>
              <div className="relative h-full flex flex-col justify-center items-center p-12 text-center">
                <div 
                    className="mb-8" 
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-evenly"
                    }}
                  >
                  
                  <h1 className="text-4xl font-bold text-white mb-6">Quick Digitizing</h1>
                  <div className="bg-white/20 p-6 rounded-xl">
                    <p className="text-white text-lg font-medium">
                      Thanks for registering. Please confirm your email to activate your account. 
                      After verification, you'll be able to access our digitizing services, 
                      manage orders, and start turning your designs into finished embroidery.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 p-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                <p className="text-gray-600 mb-8">Access your account to manage your digitizing projects</p>
                
                <form onSubmit={proceedLogin} noValidate className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      className={`w-full px-4 py-3 bg-white rounded-lg border 
                        ${emailTouched && emailError ? 'border-red-300' : 'border-gray-200'}
                        text-gray-900 text-sm placeholder-gray-400
                        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                        transition duration-150 ease-in-out`}
                      placeholder="you@company.com"
                    />
                    {emailTouched && emailError && (
                      <p className="mt-1.5 text-sm text-red-500">{emailError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      autoComplete="off"
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      className={`w-full px-4 py-3 bg-white rounded-lg border 
                        ${passwordTouched && passwordError ? 'border-red-300' : 'border-gray-200'}
                        text-gray-900 text-sm placeholder-gray-400
                        focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                        transition duration-150 ease-in-out`}
                      placeholder="Enter your password"
                    />
                    {passwordTouched && passwordError && (
                      <p className="mt-1.5 text-sm text-red-500">{passwordError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium
                      transition duration-150 ease-in-out
                      ${isLoading || !email || !password
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}
                      flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>

                  <div className="text-center mt-6">
                    <Link to="/register" className="text-gray-600 hover:text-gray-700 font-medium">
                      Don't have an account? <span className="text-blue-600 hover:text-blue-700">Sign up</span>
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm">Forgot password?</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;