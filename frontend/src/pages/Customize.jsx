import React, { useState } from "react";
import { materialAssets } from '../assets/material/material_assets.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import upload from '../assets/upload_area.png'; 

const API_URL = import.meta.env.VITE_BACKEND_URL;

const materialsData = {
  bead: [
    { name: "Amethyst ", image: materialAssets.Amethyst },
    { name: "Black Onyx", image: materialAssets.BlackOnyx },
    { name: "Tiger Eye", image: materialAssets.TigerEye },
    { name: "Evil Eye", image: materialAssets.EvilEye },
    { name: "Lapis Lazuli", image: materialAssets.LapisLazuli },
    { name: "Green Jade", image: materialAssets.GreenJade },
  ],
  pearl: [
    { name: "Pearl A", image: materialAssets.WhitePearl },
    { name: "Pearl B", image: materialAssets.PinkPearl },
  ],
  stone: [
   {name: "Blue Stone", image: materialAssets.BlueStone},
   {name: "Brown Stone", image: materialAssets.BrownStone},
  ],
  charm: [
    {name: "Smiley Face", image: materialAssets.SmileyFace},
    {name: "Feather", image: materialAssets.Feather},
  ],
};

const CustomizeProduct = () => {
  const [selectedAccessory, setSelectedAccessory] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [referenceImage, setReferenceImage] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");

  const handleMaterialToggle = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((m) => m !== material) : [...prev, material]
    );
  };

  const handleOptionSelect = (material, optionName) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [material]: optionName,
    }));
  };

  const handleImageUpload = (e) => {
    setReferenceImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('productId', 'custom-product');
    formData.append('customizationType', selectedAccessory);
    formData.append('description', JSON.stringify({
      materials: selectedMaterials,
      options: selectedOptions,
    }));
    formData.append('customerName', customerName);
    formData.append('customerContact', customerContact);
    if (referenceImage) {
      formData.append('referenceImage', referenceImage);
    }

    try {
      const response = await fetch(`${API_URL}/api/customizations`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit customization');
      }

      const data = await response.json();
      toast.success('Customization submitted successfully!');
      
      setSelectedAccessory('');
      setSelectedMaterials([]);
      setSelectedOptions({});
      setReferenceImage(null);
      setCustomerName('');
      setCustomerContact('');
    } catch (error) {
      console.error('Error submitting customization:', error);
      alert(error.message || 'Failed to submit customization. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-6">🎨 Customize Your Accessories</h2>
      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-2">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">Contact Number</label>
              <input
                type="tel"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                pattern="^(98|97)[0-9]{8}$"
                className="w-full p-2 border rounded"
                placeholder="Ex: 9876543210"
                required
              />
            </div>
          </div>
        </div>

        {/* Accessory Type */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Select accessory</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedAccessory}
            onChange={(e) => setSelectedAccessory(e.target.value)}
            required
          >
            <option value="">Choose Accessories</option>
            <option value="bracelet">Bracelet</option>
            <option value="necklace">Necklace</option>
            <option value="earring">Earring</option>
          </select>
        </div>

        {/* Material Checkboxes */}
        <div className="mb-6">
          <p className="font-medium mb-2">Select materials:</p>
          {Object.keys(materialsData).map((material) => (
            <div key={material} className="mb-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => handleMaterialToggle(material)}
                />
                {material.charAt(0).toUpperCase() + material.slice(1)}
              </label>

              {selectedMaterials.includes(material) && (
                <div className="flex flex-wrap mt-3 ml-4 gap-4">
                  {materialsData[material].map((option) => (
                    <label key={option.name} className="flex flex-col items-center w-28">
                      <input
                        type="radio"
                        name={`option-${material}`}
                        value={option.name}
                        className="mb-1"
                        checked={selectedOptions[material] === option.name}
                        onChange={() => handleOptionSelect(material, option.name)}
                      />
                      <img
                        src={option.image}
                        alt={option.name}
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                      <span className="text-sm mt-1 text-center">{option.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Upload reference image (optional):</label>
          <div className="flex items-center justify-center w-full">
            <label 
              htmlFor="image1" 
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <img 
                  className="w-20 h-20 mb-3 object-contain" 
                  src={!referenceImage ? upload : URL.createObjectURL(referenceImage)} 
                  alt="Upload preview" 
                />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
              </div>
              <input 
                onChange={(e) => setReferenceImage(e.target.files[0])} 
                type="file" 
                id="image1" 
                className="hidden" 
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow"
          >
            Submit Customization
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomizeProduct;
