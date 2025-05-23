// src/services/api.js
import { createObjectToFormData } from "../features/utils/helper";
import { endpoints } from "./Endpoints";
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from './fetchWithAuth';


export const login = async (credentials) => {

    const response = await fetchWithAuth(endpoints.login, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return await response.json();
};

export const registerUser = async (userData) => {
    const response = await fetchWithAuth(endpoints.register, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return await response.json();
};



export const getAuthorizedUser = async (token) => {
    const response = await fetchWithAuth(endpoints.getAuthorizedUser, {
        method: 'GET',
        headers: {
            'x-auth-token': token,
        },
    });
    navigate('/login'); 

    return await response.json();


};

    // getAuthorizedUser.interceptors.response.use(
    //     (response) => response,
    //     (error) => {
    //       if (error.response?.status === 401) {
        
    //         const navigate = useNavigate();
        
    //         navigate('/login'); 
    //       }
    //       return Promise.reject(error);
    //     }
    //   );

// New quotation functions

/**
 * Fetch all quotations
 */

export const getQuotations = async (token) => {
   
    const response = await fetchWithAuth(endpoints.getQuotations, {
        method: 'GET',
        headers: {
            'x-auth-token': token,
           
        },
    });
    // console.log(response.data)
    if (!response.ok) {
        throw new Error(`Failed to fetch quotations: ${response.statusText}`);
    }
    return await response.json();
};


/**
 * Fetch a single quotation by ID
 */
export const getQuotationById = async (id, token) => {
    const response = await fetchWithAuth(endpoints.getQuotationById(id), {
        method: 'GET',
        headers: {
            'x-auth-token': token,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch quotation: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Delete a quotation by ID
 */
export const deleteQuotation = async (id, token) => {
    const response = await fetchWithAuth(endpoints.deleteQuotation(id), {
        method: 'DELETE',
        headers: {
            'x-auth-token': token,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to delete quotation: ${response.statusText}`);
    }
    return await response.json();
};

/**
 * Create a new quotation
 */
export const createQuotation = async(quotationData, token) => {
    console.log(quotationData,token)
    console.log(token)
   if(quotationData && token){
    const payloadData = createObjectToFormData(quotationData)
    
    const response = await fetchWithAuth(endpoints.createQuotation, {
        method: 'POST',
        headers: {
            'x-auth-token': token,
            
        },
        body: payloadData,
    });
    if (!response.ok) {
        throw new Error(`Failed to create quotation: ${response.statusText}`);
    }
    return await response.json();
   }
};



/**
 * Update an existing quotation by ID
 */
export const updateQuotation = async (id, quotationData, token) => {
  console.log(id, quotationData, token)
  const formData = new FormData()
//   console.log(Object.keys(quotationData))
  Object.keys(quotationData).forEach(key=>{
    // console.log(key)
    formData.append(key, quotationData[key])
  })
//   console.log(formData)
    const response = await fetchWithAuth(endpoints.updateQuotation(id), {
        method: 'PUT',
        headers: {
        
            'x-auth-token': token,
            
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Failed to update quotation: ${response.statusText}`);
    }
    return await response.json();
};


// orders  

export const createOrder = async(orderData, token) => {


    if(orderData && token ){
        const payloadData = createObjectToFormData(orderData)
    const response = await fetchWithAuth(endpoints.createOrder, {
        method: 'POST',
        headers: {
            'x-auth-token': token,
        },
        body:payloadData ,
    });
    if (!response.ok) {
        throw new Error(`Failed to create Order: ${response.statusText}`);
    }
    return await response.json();
    }
};

export const getOrders = async (token) => {
    const response = await fetchWithAuth(endpoints.getOrders, {
        method: 'GET',
        headers: {
            'x-auth-token': token,
        
        },
    });
    // console.log(response)
    if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
    }
    return await response.json();
};

export const getOrderById = async (id, token) => {
    const response = await fetchWithAuth(endpoints.getOrderById(id), {
        method: 'GET',
        headers: {
            'x-auth-token': token,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch quotation: ${response.statusText}`);
    }
    return await response.json();
};

export const deleteOrder = async (id, token) => {
    const response = await fetchWithAuth(endpoints.deleteOrder(id), {
        method: 'DELETE',
        headers: {
            'x-auth-token': token,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to delete order: ${response.statusText}`);
    }
    return await response.json();
};

export const updateOrder = async (id, orderData, token) => {
    // console.log(id, orderData, token)
    const formData = new FormData()
  //   console.log(Object.keys(quotationData))
    Object.keys(orderData).forEach(key=>{
    //   console.log(key)
      formData.append(key, orderData[key])
    })
    // console.log(formData)
      const response = await fetchWithAuth(endpoints.updateOrder(id), {
          method: 'PUT',
          headers: {
          
              'x-auth-token': token,
              
          },
          body: formData,
      });
      if (!response.ok) {
          throw new Error(`Failed to update quotation: ${response.statusText}`);
      }
      return await response.json();
  };
  




export const changePasswordApi = async (userId, newPassword, token) => {
    // console.log(endpoints.changePassword)
    // console.log(`${userId}`,newPassword,token)
    const response = await fetchWithAuth(endpoints.changePassword, {
        method: 'PUT', 
        headers: {
            'x-auth-token': token, 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId, 
            newPassword, 
        }),
    });

    if (!response.ok) {
        throw new Error(`Failed to change password: ${response.statusText}`);
    }

    return await response.json();
};


// Approve Quotation API
export const approveQuotation = async (id, token) => {
    const response = await fetchWithAuth(endpoints.approveQuotation(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json', // Set content type
            'x-auth-token': token, // Include the token in the headers
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve quotation');
    }

    return await response.json(); // Return the response as JSON if successful
};

// Reject Quotation API
export const rejectQuotation = async (id, token) => {
    const response = await fetchWithAuth(endpoints.rejectQuotation(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json', // Set content type
            'x-auth-token': token, // Include the token in the headers
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject quotation');
    }

    return await response.json(); // Return the response as JSON if successful
};


export const updateOrderStatus = async (id,status, token) => {
    const response = await fetchWithAuth(endpoints.updateOrderStatus(id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json', // Set content type
            'x-auth-token': token, // Include the token in the headers
        },
        body: JSON.stringify({ status }), // Include the status in the body
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve quotation');
    }

    return await response.json(); // Return the response as JSON if successful
};


export const createPayment = async (id, token) => {
    const response = await fetchWithAuth(endpoints.createPayment(id), {
        method: 'POST',
        headers: {
            'x-auth-token': token,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to Create Payment: ${response.statusText}`);
    }
    return await response.json();
};