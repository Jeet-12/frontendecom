import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Track active sub-menu
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sideBar = [
    {
      name: "Profile",
      to: "admin-profile",
      subItems: [
        { name: "View Profile", to: "admin-profile" },
        // { name: "Manage Orders", to: "manage-orders" },
      ],
    },
    // {
    //   name: "Images",
    //   to: "admin-images",
    //   subItems: [
    //     { name: "Upload Image", to: "upload-image" },
    //     { name: "Manage Images", to: "manage-images" },
    //   ],
    // },
    {
      name: "Order",
      to: "order",
      subItems: [
        { name: "Create Orders", to: "order/form" },
        { name: "View Orders", to: "order" },
      ],
    },
    {
      name: "Quotation",
      to: "quotation",
      subItems: [
        { name: "Create Quotation", to: "quotation/form" },
        { name: "View Quotations", to: "quotation" },
      ],
    },
    {
      name: "Users",
      to: "users",
      subItems: [
        // { name: "Add User", to: "add-user" },
        { name: "Manage Users", to: "users" },
      ],
    },
    {
      name: "Gallery",
      to: "gallery",
      subItems: [
        { name: "Add Image", to: "add-gallerimg" },
        { name: "All Images", to: "all-galleryimg" },
      ],
    },
    {
      name: "Logout",
      action: logout,
    },
  ];

  // Toggle visibility of sub-menu
  const toggleSubMenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index); // Toggle between showing and hiding
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar");
      const toggleButton = document.querySelector(".sidebar-toggle");
      if (sidebar && !sidebar.contains(event.target)) {
        if (toggleButton && !toggleButton.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Small Sidebar Toggle Button */}
      <button
        className="sidebar-toggle md:hidden p-2 text-white bg-gray-600 rounded fixed z-20 top-5 left-5"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "✖️" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar fixed inset-0 z-20 transition-transform transform bg-gray-800 text-white md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:w-72 w-64 shadow-lg`}
      >
        {/* Sidebar Header */}
        <div className="bg-gray-700 py-4 text-center text-xl font-semibold text-white" onClick={()=>{navigate("/")}}>
          
        Admin Dashboard 
        </div>

        {/* Sidebar Content */}
        <menu className="flex-1 px-4 py-6 space-y-4">
          {sideBar.map((data, index) => (
            <li key={data.name} className="w-full">
              {data.action ? (
                <button
                  onClick={data.action}
                  className="w-full py-2 px-4 bg-red-600 hover:bg-red-500 rounded-md text-base font-medium text-white flex items-center justify-start transition-colors duration-200"
                >
                  {data.name}
                </button>
              ) : (
                <div>
                  <div
                    className={`w-full py-2 px-4 rounded-md text-base font-medium flex items-center justify-start transition-colors duration-200 cursor-pointer ${activeSubMenu === index ? "bg-green-600 text-white" : "text-gray-400 hover:text-gray-100"
                      }`}
                    onClick={() => toggleSubMenu(index)} // Toggle sub-menu visibility
                  >
                    {data.name}
                  </div>
                  {data.subItems && activeSubMenu === index && (
                    <ul className="ml-6 mt-2 space-y-2">
                      {data.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <NavLink
                            to={subItem.to}
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
                            onClick={() => setSidebarOpen(false)} // Close sidebar on mobile
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </menu>
      </div>

      {/* Modal Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)} // Close sidebar when clicking outside
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white shadow-lg overflow-x-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;