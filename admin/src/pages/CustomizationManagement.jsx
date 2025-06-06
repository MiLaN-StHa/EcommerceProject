import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const CustomizationManagement = ({token}) => {
  const [customizations, setCustomizations] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)

  const fetchCustomizations = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/customizations')
      if (response.data.success) {
        setCustomizations(response.data.customizations)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeCustomization = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/customizations/remove',
        { id },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success(response.data.message)
        await fetchCustomizations()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  


  const updateCustomizationStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${backendUrl}/api/customizations/${id}/status`,
      { status },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success(response.data.message);
      await fetchCustomizations();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};


  useEffect(() => {
    fetchCustomizations()
  }, [])

  return (
    <div className="p-4">
      <h2 className='text-xl font-semibold mb-4'>Customization Requests</h2>
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Table Header */}
        <div className='hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-3 px-4 bg-gray-50 text-sm font-medium text-gray-600'>
          <span>Customer</span>
          <span>Contact</span>
          <span>Product</span>
          <span>Materials</span>
          <span>Options</span>
          <span>Reference</span>
          <span className='pl-5'>Action</span>
        </div>

        {/* Customization List */}
        <div className='divide-y divide-gray-200'>
          {customizations.map((item, index) => {
            const description = typeof item.description === 'string'
              ? JSON.parse(item.description)
              : item.description || {}

            return (
              <div
                className='grid grid-cols-3 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 text-sm hover:bg-gray-50 transition-colors'
                key={index}
              >
                <div className="md:col-span-1">
                  <p className="font-medium text-gray-900">{item.customerName}</p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-600">{item.customerContact}</p>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-900 capitalize">{item.customizationType}</p>
                </div>
                <div className="md:col-span-1">
                  <div className="flex flex-wrap gap-1">
                    {description.materials?.map((material, i) => (
                      <span
                        key={i}
                        className='inline-block bg-gray-100 rounded-full px-2.5 py-1 text-xs text-gray-700'
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="space-y-1">
                    {Object.entries(description.options || {}).map(([key, value]) => (
                      <div key={key} className='text-xs text-gray-600'>
                        <span className='font-medium text-gray-700'>{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-1">
                  {item.referenceImage && (
                    <button
                      onClick={() => setSelectedImage(item.referenceImage)}
                      className='focus:outline-none hover:opacity-90 transition-opacity'
                    >
                      <img
                        src={item.referenceImage}
                        alt="Reference"
                        className='w-14 h-14 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow'
                      />
                    </button>
                  )}
                </div>
                <div className="md:col-span-1">
                 <div className="flex flex-col gap-1 items-start">
  <span className='text-xs text-gray-500'>Status: {item.status}</span>
  {item.status === 'pending' && (
    <div className='flex gap-3'>
      <button
        onClick={() => updateCustomizationStatus(item._id, 'approved')}
        className='text-green-600 hover:text-green-800 transition-colors text-sm font-medium'
      >
        Accept
      </button>
      <button
        onClick={() => updateCustomizationStatus(item._id, 'rejected')}
        className='text-yellow-600 hover:text-yellow-800 transition-colors text-sm font-medium'
      >
        Reject
      </button>
    </div>
  )}
  <button
    onClick={() => removeCustomization(item._id)}
    className='text-red-500 hover:text-red-700 transition-colors text-sm font-medium'
  >
    Remove
  </button>
</div>


                </div>
              </div>
            )
          })}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
            onClick={() => setSelectedImage(null)}
          >
            <div className='relative max-w-4xl w-full mx-4'>
              <button
                className='absolute top-4 right-4 text-white hover:text-gray-300 transition-colors'
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt='Reference'
                className='max-h-[80vh] w-auto mx-auto rounded-lg shadow-2xl'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomizationManagement
