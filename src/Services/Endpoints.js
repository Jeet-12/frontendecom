export const endpoints = {
    login: `${process.env.VITE_API_BASE_URL}api/auth/login`,
    register: `${process.env.VITE_API_BASE_URL}api/auth/register`,
    getAuthorizedUser: `${process.env.VITE_API_BASE_URL}api/auth/authorized-user`,
    changePassword: `${process.env.VITE_API_BASE_URL}api/auth/update-password`,
  // New quotation endpoints
    getQuotations: `${process.env.VITE_API_BASE_URL}api/quotation/`,
    getQuotationById: (id) => `${process.env.VITE_API_BASE_URL}api/quotation/${id}`,
    deleteQuotation: (id) => `${process.env.VITE_API_BASE_URL}api/quotation/${id}`,
    createQuotation: `${process.env.VITE_API_BASE_URL}api/quotation/create`,
    updateQuotation: (id) => `${process.env.VITE_API_BASE_URL}api/quotation/${id}`,


    getOrders: `${process.env.VITE_API_BASE_URL}api/order/`,
    getOrderById: (id) => `${process.env.VITE_API_BASE_URL}api/order/${id}`,
    deleteOrder: (id) => `${process.env.VITE_API_BASE_URL}api/order/${id}`,
    createOrder: `${process.env.VITE_API_BASE_URL}api/order/create`,
    updateOrder: (id) => `${process.env.VITE_API_BASE_URL}api/order/${id}`,


    approveQuotation: (id)=>`${process.env.VITE_API_BASE_URL}api/quotation/approve/${id}`,
    rejectQuotation: (id)=>`${process.env.VITE_API_BASE_URL}api/quotation/reject/${id}`,

    updateOrderStatus: (id)=>`${process.env.VITE_API_BASE_URL}api/order/${id}/status`,

    createPayment: `${process.env.VITE_API_BASE_URL}api/payment/paypal/create-order`,

};