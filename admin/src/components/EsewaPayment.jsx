import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const EsewaPayment = ({ amount, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initiatePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`${backendUrl}/api/payment/esewa/initiate`, {
                amount: amount
            });

            if (response.data.success) {
                const { esewaParams, paymentUrl } = response.data;

                // Create and submit form to eSewa
                const form = document.createElement('form');
                form.setAttribute('method', 'POST');
                form.setAttribute('action', paymentUrl);

                // Add all eSewa parameters as hidden fields
                Object.entries(esewaParams).forEach(([key, value]) => {
                    const hiddenField = document.createElement('input');
                    hiddenField.setAttribute('type', 'hidden');
                    hiddenField.setAttribute('name', key);
                    hiddenField.setAttribute('value', value);
                    form.appendChild(hiddenField);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                setError('Failed to initiate payment');
                if (onFailure) onFailure('Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setError(error.response?.data?.message || 'Payment initiation failed');
            if (onFailure) onFailure(error.response?.data?.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={initiatePayment}
                disabled={loading}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                    loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-500 hover:bg-green-600'
                }`}
            >
                {loading ? 'Processing...' : 'Pay with eSewa'}
            </button>
            
            {error && (
                <div className="text-red-500 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default EsewaPayment; 