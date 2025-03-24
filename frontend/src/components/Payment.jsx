import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';

const Payment = ({ orderId, amount }) => {
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/esewa/initiate`, {
                orderId,
                amount
            });

            if (response.data.success) {
                // Create form and submit to eSewa
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = response.data.paymentUrl;

                // Add payment data as hidden fields
                Object.entries(response.data.paymentData).forEach(([key, value]) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });

                // Add form to document and submit
                document.body.appendChild(form);
                form.submit();
                document.body.removeChild(form);
            } else {
                alert('Payment initiation failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment initiation failed');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
            <div className="mb-4">
                <p className="text-gray-600">Order ID: {orderId}</p>
                <p className="text-gray-600">Amount: Rs. {amount}</p>
            </div>
            <button
                onClick={handlePayment}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
                Pay with eSewa
            </button>
        </div>
    );
};

export default Payment; 