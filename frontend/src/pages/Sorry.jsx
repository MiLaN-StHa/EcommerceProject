import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sorry = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-red-500 mb-4">We're Sorry!</h1>
      <p className="text-lg text-gray-700 mb-6">
        This payment feature is currently unavailable, but don't worry — it will be available in the future. 
        Please try another payment method or come back later.
      </p>
      
      <button 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition-all"
        onClick={() => navigate("/cart")}
      >
        Go Back to Cart
      </button>
    </div>
  );
};

export default Sorry;
