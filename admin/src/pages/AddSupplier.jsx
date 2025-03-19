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

  // Calculate totals for a material
  const calculateMaterialTotals = (material) => {
    const quantity = Number(material.quantity) || 0;
    const pricePerUnit = Number(material.pricePerUnit) || 0;
    const amountPaid = Number(material.amountPaid) || 0;
    const totalAmount = quantity * pricePerUnit;
    const remainingAmount = totalAmount - amountPaid;

    return {
      ...material,
      quantity,
      pricePerUnit,
      amountPaid,
      totalAmount,
      remainingAmount
    };
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!supplierName || !rawMaterials.length) {
      return toast.error("Please fill in all required fields");
    }

    // Convert string values to numbers and validate
    const formattedMaterials = rawMaterials.map(calculateMaterialTotals);

    // Validate all materials
    const invalidMaterial = formattedMaterials.find(
      material =>
        !material.materialName ||
        material.quantity <= 0 ||
        material.pricePerUnit <= 0 ||
        material.amountPaid < 0
    );

    if (invalidMaterial) {
      return toast.error("Please fill in all fields with valid numbers");
    }

    // Calculate supplier totals
    const totalAmount = formattedMaterials.reduce((sum, material) => sum + material.totalAmount, 0);
    const totalPaid = formattedMaterials.reduce((sum, material) => sum + material.amountPaid, 0);
    const totalRemaining = totalAmount - totalPaid;

    const newSupplier = {
      supplierName,
      rawMaterials: formattedMaterials,
      totalAmount,
      totalPaid,
      totalRemaining
    };

    try {
      const response = await axios.post(
        backendUrl + "/api/supplier/add",
        newSupplier,
        {
          headers: { token },
        }
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
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Add New Supplier</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Supplier Name</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Raw materials list */}
        <div className="space-y-4">
          <h3 className="font-medium">Raw Materials</h3>
          {rawMaterials.map((material, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Material Name</label>
                  <input
                    type="text"
                    value={material.materialName}
                    onChange={(e) => {
                      const updatedMaterials = [...rawMaterials];
                      updatedMaterials[index].materialName = e.target.value;
                      setRawMaterials(updatedMaterials);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={material.quantity}
                    onChange={(e) => {
                      const updatedMaterials = [...rawMaterials];
                      updatedMaterials[index].quantity = e.target.value;
                      setRawMaterials(updatedMaterials);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block mb-1">Price Per Unit (₹)</label>
                  <input
                    type="number"
                    value={material.pricePerUnit}
                    onChange={(e) => {
                      const updatedMaterials = [...rawMaterials];
                      updatedMaterials[index].pricePerUnit = e.target.value;
                      setRawMaterials(updatedMaterials);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    min="0"
                    step="any"
                  />
                </div>

                <div>
                  <label className="block mb-1">Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={material.amountPaid}
                    onChange={(e) => {
                      const updatedMaterials = [...rawMaterials];
                      updatedMaterials[index].amountPaid = e.target.value;
                      setRawMaterials(updatedMaterials);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    min="0"
                    step="any"
                  />
                </div>
              </div>

              {/* Show calculated totals */}
              {material.quantity && material.pricePerUnit && (
                <div className="mt-4 text-sm text-gray-600">
                  <p>Total Amount: ₹{(Number(material.quantity) * Number(material.pricePerUnit)).toFixed(2)}</p>
                  {material.amountPaid && (
                    <p>Remaining Amount: ₹{((Number(material.quantity) * Number(material.pricePerUnit)) - Number(material.amountPaid)).toFixed(2)}</p>
                  )}
                </div>
              )}

              {rawMaterials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRawMaterial(index)}
                  className="mt-4 px-4 py-2 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                >
                  Remove Material
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Show supplier totals */}
        {rawMaterials.some(m => m.quantity && m.pricePerUnit) && (
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-2">Supplier Totals</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Total Amount: ₹{rawMaterials.reduce((sum, m) => sum + (Number(m.quantity) * Number(m.pricePerUnit)), 0).toFixed(2)}</p>
              <p>Total Paid: ₹{rawMaterials.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0).toFixed(2)}</p>
              <p>Total Remaining: ₹{(
                rawMaterials.reduce((sum, m) => sum + (Number(m.quantity) * Number(m.pricePerUnit)), 0) -
                rawMaterials.reduce((sum, m) => sum + (Number(m.amountPaid) || 0), 0)
              ).toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={addRawMaterial}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Another Material
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Supplier
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier; 