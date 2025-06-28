export const endpoints = {
    login: `${import.meta.env.VITE_API_BASE_URL}api/auth/login`,
    register: `${import.meta.env.VITE_API_BASE_URL}api/auth/register`,
    getAuthorizedUser: `${import.meta.env.VITE_API_BASE_URL}api/auth/authorized-user`,
    changePassword: `${import.meta.env.VITE_API_BASE_URL}api/auth/update-password`,
  // New quotation endpoints
    getQuotations: `${import.meta.env.VITE_API_BASE_URL}api/quotation/`,
    getQuotationById: (id) => `${import.meta.env.VITE_API_BASE_URL}api/quotation/${id}`,
    deleteQuotation: (id) => `${import.meta.env.VITE_API_BASE_URL}api/quotation/${id}`,
    createQuotation: `${import.meta.env.VITE_API_BASE_URL}api/quotation/create`,
    updateQuotation: (id) => `${import.meta.env.VITE_API_BASE_URL}api/quotation/${id}`,


    getOrders: `${import.meta.env.VITE_API_BASE_URL}api/order/`,
    getOrderById: (id) => `${import.meta.env.VITE_API_BASE_URL}api/order/${id}`,
    deleteOrder: (id) => `${import.meta.env.VITE_API_BASE_URL}api/order/${id}`,
    createOrder: `${import.meta.env.VITE_API_BASE_URL}api/order/create`,
    updateOrder: (id) => `${import.meta.env.VITE_API_BASE_URL}api/order/${id}`,


    approveQuotation: (id)=>`${import.meta.env.VITE_API_BASE_URL}api/quotation/approve/${id}`,
    rejectQuotation: (id)=>`${import.meta.env.VITE_API_BASE_URL}api/quotation/reject/${id}`,

    updateOrderStatus: (id)=>`${import.meta.env.VITE_API_BASE_URL}api/order/${id}/status`,

    createPayment: `${import.meta.env.VITE_API_BASE_URL}api/payment/paypal/create-order`,

};