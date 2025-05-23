import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { getInitials } from "../features/utils/helper";
import logo from "../assets/Logo.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Service", path: "/service" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
];

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const role = localStorage.getItem("user");
  const data = role ? JSON.parse(role) : null;
  const [hoveredItem, setHoveredItem] = useState(null);


  useEffect(() => {
    setIsLoggedIn(loginState);
  }, [loginState]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOrderDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logOut = () => {
    localStorage.clear();
    dispatch(logoutUser());
    navigate("/login");
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const handleOrderHover = () => setIsOrderDropdownOpen(true);
  const handleOrderLeave = () => setIsOrderDropdownOpen(false);

  const handleOrderClick = (e) => {
    e.preventDefault();
    setIsOrderDropdownOpen((prev) => !prev);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleStatusClick = (status) => {
    navigate(`/order`, { state: { status } });
    setIsOrderDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleCreateOrderClick = () => {
    navigate("/order/form");
    setIsOrderDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setIsOrderDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const isOrderActive = () => {
    return (
      location.pathname === "/order" ||
      location.pathname === "/order/form" ||
      (location.pathname === "/order" && location.state?.status)
    );
  };

  return (
    <header className="bg-[#93C572] shadow-md">
      <div className="max-w-[70rem] mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" className="w-44" />
        </Link>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-2xl text-[#000000] hover:text-[#FFFFFF]"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaWindowClose /> : <HiMiniBars3BottomLeft />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 relative">
          {navItems.map((item) => {
            if ((item.name === "Login" || item.name === "Register") && isLoggedIn) {
              return null;
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-xl font-bold tracking-wide transition-all duration-300 ease-in-out 
                   ${isActive ? "text-[#FFFFFF] drop-shadow-lg scale-105" : "text-[#000000] hover:text-[#FFFFFF] hover:scale-110"}`
                }
              >
                {item.name}
              </NavLink>
            );
          })}

          {isLoggedIn && data?.role === "admin" && (
            <NavLink
              to="/admin/admin-profile"
              className={({ isActive }) =>
                `text-xl font-bold tracking-wide transition-all duration-300 ease-in-out 
                   ${isActive ? "text-[#FFFFFF] drop-shadow-lg scale-105" : "text-[#000000] hover:text-[#FFFFFF] hover:scale-110"}`
              }
            >
              Admin Dashboard
            </NavLink>
          )}
          {isLoggedIn && data?.role === "user" && (
            <>
              <NavLink
                to="quotation"
                className={({ isActive }) =>
                  `text-xl font-bold tracking-wide transition-all duration-300 ease-in-out 
                   ${isActive ? "text-[#FFFFFF] drop-shadow-lg scale-105" : "text-[#000000] hover:text-[#FFFFFF] hover:scale-110"}`
                }
              >
                Quotation
              </NavLink>
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleOrderHover}
                onMouseLeave={handleOrderLeave}
              >
                <button
                  className={`text-xl font-bold tracking-wide transition-all duration-300 ease-in-out 
                    ${isOrderActive() ? "text-[#FFFFFF] drop-shadow-lg scale-105" : "text-[#000000] hover:text-[#FFFFFF] hover:scale-110"}`}
                  onClick={handleOrderClick}
                >
                  Order
                </button>
                {isOrderDropdownOpen && (
                  <div className="absolute top-6 bg-[#FFFFFF] shadow-lg rounded-md p-4 w-48" style={{ zIndex: 100 }}>
                    <div
                      className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order/form" ? "text-[#3B82F6] font-semibold" : "text-[#4B5563]"}`}
                      onClick={handleCreateOrderClick}
                    >
                      Create Order
                    </div>
                    <div
                      className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order" && location.state?.status === "Pending" ? "text-[#3B82F6] font-semibold" : "text-[#4B5563]"}`}
                      onClick={() => handleStatusClick("Pending")}
                    >
                      Pending
                    </div>
                    <div
                      className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order" && location.state?.status === "InProgress" ? "text-[#3B82F6] font-semibold" : "text-[#EAB308]"}`}
                      onClick={() => handleStatusClick("InProgress")}
                    >
                      In Progress
                    </div>
                    <div
                      className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order" && location.state?.status === "Complete" ? "text-[#3B82F6] font-semibold" : "text-[#22C55E]"}`}
                      onClick={() => handleStatusClick("Complete")}
                    >
                      Completed
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden absolute top-16 left-0 right-0 bg-[#93C572] shadow-lg z-50">
            <div className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => {
                if ((item.name === "Login" || item.name === "Register") && isLoggedIn) {
                  return null;
                }
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `text-lg font-medium capitalize transition duration-200 ${isActive ? "text-[#FFFFFF]" : "text-[#000000] hover:text-[#FFFFFF]"
                      }`
                    }
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </NavLink>
                );
              })}

              {isLoggedIn && data?.role === "admin" && (
                <NavLink
                  to="/admin/admin-profile"
                  className={({ isActive }) =>
                    `text-lg font-medium capitalize transition duration-200 ${isActive ? "text-[#FFFFFF]" : "text-[#000000] hover:text-[#FFFFFF]"
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  Admin Dashboard
                </NavLink>
              )}
              {isLoggedIn && data?.role === "user" && (
                <>
                  <NavLink
                    to="quotation"
                    className={({ isActive }) =>
                      `text-lg font-medium capitalize transition duration-200 ${isActive ? "text-[#FFFFFF]" : "text-[#000000] hover:text-[#FFFFFF]"
                      }`
                    }
                    onClick={toggleMobileMenu}
                  >
                    Quotation
                  </NavLink>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      className={`text-lg font-medium capitalize transition duration-200 ${isOrderActive() ? "text-[#FFFFFF]" : "text-[#000000] hover:text-[#FFFFFF]"}`}
                      onClick={handleOrderClick}
                    >
                      Order
                    </button>
                    {isOrderDropdownOpen && (
                      <div className="mt-2 bg-[#FFFFFF] shadow-lg rounded-md p-4 w-48">
                        <div
                          className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order/form" ? "text-[#3B82F6] font-semibold" : "text-[#4B5563]"}`}
                          onClick={handleCreateOrderClick}
                        >
                          Create Order
                        </div>
                        <div
                          className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order" && location.state?.status === "Pending" ? "text-[#3B82F6] font-semibold" : "text-[#4B5563]"}`}
                          onClick={() => handleStatusClick("Pending")}
                        >
                          Pending
                        </div>
                        <div
                          className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order" && location.state?.status === "InProgress" ? "text-[#3B82F6] font-semibold" : "text-[#EAB308]"}`}
                          onClick={() => handleStatusClick("InProgress")}
                        >
                          In Progress
                        </div>
                        <div
                          className={`py-2 px-4 hover:bg-[#F3F4F6] rounded-md cursor-pointer ${location.pathname === "/order" && location.state?.status === "Complete" ? "text-[#3B82F6] font-semibold" : "text-[#22C55E]"}`}
                          onClick={() => handleStatusClick("Complete")}
                        >
                          Completed
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      className="flex items-center gap-2 text-lg font-medium capitalize transition duration-200 text-[#000000] hover:text-[#FFFFFF]"
                      onClick={handleProfileClick}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-bold text-[#93C572]">
                        {getInitials(data?.email)}
                      </div>
                      Profile
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="mt-2 bg-[#FFFFFF] shadow-lg rounded-md p-4 w-48">
                        <Link
                          to="/user-profile"
                          className="block py-2 px-4 hover:bg-[#F3F4F6] rounded-md text-[#4B5563]"
                          onClick={() => {
                            navigate("/user-profile");
                            setIsMobileMenuOpen(false);
                            setIsProfileDropdownOpen(false);
                          }}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/order-history"
                          className="block py-2 px-4 hover:bg-[#F3F4F6] rounded-md text-[#4B5563]"
                          onClick={() => {
                            navigate("/order-history");
                            setIsMobileMenuOpen(false);
                            setIsProfileDropdownOpen(false);
                          }}
                        >
                          Order History
                        </Link>
                        <Link
                          to="/password"
                          className="block py-2 px-4 hover:bg-[#F3F4F6] rounded-md text-[#4B5563]"
                          onClick={() => {
                            navigate("/password");
                            setIsMobileMenuOpen(false);
                            setIsProfileDropdownOpen(false);
                          }}
                        >
                          Change Password
                        </Link>
                        <button
                          onClick={logOut}
                          className="w-full text-left py-2 px-4 hover:bg-[#EF4444] hover:text-[#FFFFFF] rounded-md text-[#4B5563]"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </nav>
        )}

        {/* User Avatar & Dropdown for Desktop */}
        {isLoggedIn && data?.role === "user" && (
          <div className="hidden md:block">
            <div className="dropdown dropdown-end" ref={profileDropdownRef}>
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 text-2xl pt-1 h-10 rounded-full ring-2 ring-offset-2 ring-gradient-to-r from-[#60A5FA] via-[#A78BFA] to-[#EC4899] hover:ring-offset-4 transition-all transform hover:scale-110">
                  {getInitials(data?.email)}
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm bg-[#FFFFFF] text-[#1F2937] dropdown-content mt-3 z-[1] p-4 shadow-xl rounded-lg w-60 space-y-2"
              >
                <li className="rounded-md transition-colors py-2 px-4 hover:bg-[#93C572] hover:text-white">
                  <Link to="/user-profile" className="flex items-center gap-2 hover:text-white">
                    <i className="pi pi-user"></i> Profile
                  </Link>
                </li>
                <li className="rounded-md transition-colors py-2 px-4 hover:bg-[#93C572] hover:text-white">
                  <Link to="/order-history" className="flex items-center gap-2 hover:text-white">
                    <i className="pi pi-box"></i> Order History
                  </Link>
                </li>
                <li className="rounded-md transition-colors py-2 px-4 hover:bg-[#93C572] hover:text-white">
                  <Link to="/password" className="flex items-center gap-2 hover:text-white">
                    <i className="pi pi-lock"></i> Change Password
                  </Link>
                </li>
                <li className="rounded-md transition-colors py-2 px-4 hover:bg-[#EF4444] hover:text-white">
                  <Link onClick={logOut} className="flex items-center gap-2 hover:text-white">
                    <i className="pi pi-sign-out"></i> Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;