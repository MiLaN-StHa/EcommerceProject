import React, { useState, useEffect } from 'react';
import { backendUrl } from '../App';

const CustomizationManagement = () => {
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const fetchCustomizations = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/customizations`);
      if (!response.ok) {
        throw new Error('Failed to fetch customizations');
      }
      const data = await response.json();
      if (data.success && Array.isArray(data.customizations)) {
        setCustomizations(data.customizations);
      } else {
        setCustomizations([]);
        console.error('Invalid data format:', data);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error('Error fetching customizations:', error);
    }
  };

  const parseDescription = (description) => {
    try {
      if (typeof description === 'string') {
        return JSON.parse(description);
      }
      return description || {};
    } catch (error) {
      console.error('Error parsing description:', error);
      return {};
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!Array.isArray(customizations) || customizations.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          No customization requests found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full mx-4">
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Reference" 
              className="max-h-[80vh] w-auto mx-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Customization Requests</h1>
          <p className="text-gray-600 mt-1">View customer customization requests</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Materials</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customizations.map((customization) => {
                  const description = parseDescription(customization.description);
                  return (
                    <tr key={customization._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{customization.customerName}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customization.customerContact}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{customization.customizationType}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {description.materials?.map((material, index) => (
                            <span key={material} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                              {material}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">
                          {Object.entries(description.options || {}).map(([key, value]) => (
                            <div key={key} className="mb-1">
                              <span className="font-medium">{key}:</span> {value}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: description.beadColor || '#d4af37' }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{description.colorName || 'Gold'}</div>
                            <div className="text-xs text-gray-500">{description.beadColor || '#d4af37'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {customization.referenceImage && (
                          <button
                            onClick={() => setSelectedImage(customization.referenceImage)}
                            className="focus:outline-none"
                          >
                            <img 
                              src={customization.referenceImage} 
                              alt="Reference" 
                              className="w-16 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationManagement; 