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
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8f9fa]">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl mt-8 mb-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Left Side */}
            <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-blue-400">
              <div className="relative h-full flex flex-col">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                    alt="Fashion Shopping"
                    className="w-full h-full object-cover"
                    style={{ maxHeight: '100vh' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
                </div>
                <div className="relative h-full flex flex-col justify-between p-12">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-2xl font-bold text-white">Quick Digitizing</span>
                    </div>
                  </div>
                  <div className="my-8">
                    <h2 className="text-4xl font-bold text-white mb-4">
                      Welcome to Your<br />
                      Fashion Journey
                    </h2>
                    <p className="text-gray-200 text-lg">
                      Sign in to access exclusive deals and<br />
                      personalized recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-1/2 p-12">
              <div className="max-w-md mx-auto">
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
                    className={`w-full px-4 py-3 rounded-lg text-sm font-medium
                      transition duration-150 ease-in-out
                      ${!email || !password
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'}
                    `}
                  >
                    Sign in
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
