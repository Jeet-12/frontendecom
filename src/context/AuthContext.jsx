// import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAuthorization } from '../Services/Api';


// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const handle401 = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//     navigate('/login'); 
//   };

//   const fetchUser = async () => {
//     const token = localStorage.getItem('token'); 
//     if (token) {
//       try {
//         const userData = await getAuthorization(token);
//         if (userData?.status === 401) {
//           handle401(); 
//         } else {
//           setIsAuthenticated(true);
//           setUser(userData);
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         handle401();
//       }
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchUser(); // Fetch user info when the component mounts
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, handle401, loading }}>
//       {loading ? <div>Loading...</div> : children}
//     </AuthContext.Provider>
//   );
// };
