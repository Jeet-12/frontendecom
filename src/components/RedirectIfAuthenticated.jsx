import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
   

    if (user) {
      if (user.role === "admin") {
        navigate("/admin"); // Redirect to admin dashboard
      } else if(user.role === "user"){
        navigate("/quotation"); // Redirect to user dashboard
      }else{
        navigate("login")
      }
      toast.info("You are already logged in. Please do logged out if you want to go out");
    }
    

  }, [navigate, user]);

  // If not authenticated, allow access to children (Login or Register)
  return children;
};

export default RedirectIfAuthenticated;
