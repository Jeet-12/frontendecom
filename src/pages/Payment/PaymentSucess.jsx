import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
 


const SuccessOrder = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // PayPal order ID
    const PayerID = searchParams.get('PayerID'); // Payer ID from PayPal
    const [status, setStatus] = useState('Processing payment...');

    useEffect(() => {
        const capturePayment = async () => {
            if (token && PayerID) {
                try {
                    // Send a POST request to capture the payment
                    const response = await axios.post(
                        `${process.env.API_URL}api/payment/paypal/capture-payment`,
                        { paypalOrderId: token }, // Body contains the PayPal order ID
                        { headers: { 'Content-Type': 'application/json' } }
                    );

                    // Handle response based on API output
                    if (response.data.message === 'Payment captured successfully') {
                        setStatus('Payment successful!');
                    } else if (response.data.message === 'Payment already captured') {
                        setStatus('Payment already captured!');
                    } else {
                        setStatus('Unexpected status. Please check your order.');
                    }
                } catch (error) {
                    setStatus('Payment failed. Please try again.');
                    console.error('Error capturing payment:', error.response?.data || error.message);
                }
            } else {
                setStatus('Payment failed. Missing token or PayerID.');
            }
        };

        capturePayment();
        // Redirect after 5 seconds
        const timer = setTimeout(() => {
            navigate("/order");
        }, 5000);

        // Cleanup the timeout on component unmount
        return () => clearTimeout(timer);
    }, [token, PayerID,navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600">
                    Thank you for your order. We are processing it and you will be
                    redirected shortly.
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => navigate("/order")}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
                    >
                        Go to Orders
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessOrder;
