import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';

const PaymentSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Verify payment with backend
        const verifyPayment = async () => {
            try {
                const response = await axios.post(`${backendUrl}/api/esewa/verify`, {
                    data: window.location.search
                });

                if (response.data.success) {
                    // Payment verified successfully
                    // You can update order status or show success message
                }
            } catch (error) {
                console.error('Payment verification error:', error);
            }
        };

        verifyPayment();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">Thank you for your purchase.</p>
                <button
                    onClick={() => navigate('/orders')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    View Orders
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess; 