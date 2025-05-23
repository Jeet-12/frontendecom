import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CreatePayment = () => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expirationDate: '',
    cvv: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the payment submission logic
    toast.success('Payment processed successfully!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Payment Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              className="input input-bordered w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Card Holder Name</label>
            <input
              type="text"
              name="cardHolder"
              value={paymentData.cardHolder}
              onChange={handleChange}
              placeholder="John Doe"
              className="input input-bordered w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Expiration Date</label>
              <input
                type="text"
                name="expirationDate"
                value={paymentData.expirationDate}
                onChange={handleChange}
                placeholder="MM/YY"
                className="input input-bordered w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">CVV</label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleChange}
                placeholder="123"
                className="input input-bordered w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition duration-200"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePayment;
