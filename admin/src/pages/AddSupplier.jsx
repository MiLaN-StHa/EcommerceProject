import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddSupplier = ({ token, onSuccess }) => {
  const [supplierName, setSupplierName] = useState("");
  const [rawMaterials, setRawMaterials] = useState([
    { materialName: "", quantity: "", pricePerUnit: "", amountPaid: "" },
  ]);

  // Add new raw material row
  const addRawMaterial = () => {
    setRawMaterials([
      ...rawMaterials,
      { materialName: "", quantity: "", pricePerUnit: "", amountPaid: "" },
    ]);
  };

  // Remove raw material row
  const removeRawMaterial = (index) => {
    setRawMaterials(rawMaterials.filter((_, i) => i !== index));
  };

  // Prevent scroll on number input
  const disableScrollOnNumberInput = (e) => {
    e.target.blur();
  };

  // Handle input change
  const handleInputChange = (index, field, value) => {
    const updatedMaterials = [...rawMaterials];
    if (["quantity", "pricePerUnit", "amountPaid"].includes(field)) {
      updatedMaterials[index][field] = value === "" ? "" : parseFloat(value);
    } else {
      updatedMaterials[index][field] = value;
    }
    setRawMaterials(updatedMaterials);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !supplierName ||
      rawMaterials.some((m) => !m.materialName || m.quantity === "" || m.pricePerUnit === "")
    ) {
      return toast.error("Please fill in all required fields");
    }

    const formattedMaterials = rawMaterials.map((material) => {
      const { quantity, pricePerUnit, amountPaid = 0 } = material;
      const totalAmount = quantity * pricePerUnit;
      return {
        ...material,
        totalAmount,
        amountPaid,
        remainingAmount: totalAmount - amountPaid,
      };
    });

    const totalAmount = formattedMaterials.reduce((sum, m) => sum + m.totalAmount, 0);
    const totalPaid = formattedMaterials.reduce((sum, m) => sum + (m.amountPaid || 0), 0);

    const newSupplier = {
      supplierName,
      rawMaterials: formattedMaterials,
      totalAmount,
      totalPaid,
      totalRemaining: totalAmount - totalPaid,
    };

    try {
      const response = await axios.post(
        backendUrl + "/api/supplier/add",
        newSupplier,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSupplierName("");
        setRawMaterials([{ materialName: "", quantity: "", pricePerUnit: "", amountPaid: "" }]);
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add New Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Raw materials list */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Raw Materials</h3>
          {rawMaterials.map((material, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Material Name</label>
                  <input
                    type="text"
                    value={material.materialName}
                    onChange={(e) => handleInputChange(index, "materialName", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    value={material.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                    onWheel={disableScrollOnNumberInput}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Price Per Unit (Rs.)</label>
                  <input
                    type="number"
                    value={material.pricePerUnit}
                    onChange={(e) => handleInputChange(index, "pricePerUnit", e.target.value)}
                    onWheel={disableScrollOnNumberInput}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Amount Paid (Rs.)</label>
                  <input
                    type="number"
                    value={material.amountPaid}
                    onChange={(e) => handleInputChange(index, "amountPaid", e.target.value)}
                    onWheel={disableScrollOnNumberInput}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="0"
                    step="any"
                  />
                </div>
              </div>

              {rawMaterials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRawMaterial(index)}
                  className="mt-4 w-full sm:w-auto px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                >
                  Remove Material
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={addRawMaterial}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Add Another Material
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Submit Supplier
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;
