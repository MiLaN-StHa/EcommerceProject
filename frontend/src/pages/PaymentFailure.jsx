import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed</h1>
                <p className="text-gray-600 mb-6">Sorry, your payment could not be processed.</p>
                <button
                    onClick={() => navigate('/cart')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                    Return to Cart
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure; 