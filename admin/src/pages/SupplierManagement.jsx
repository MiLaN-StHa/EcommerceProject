import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import AddSupplier from "./AddSupplier";

const SupplierManagement = ({ token }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/supplier/list", {
        headers: { token },
      });
      if (response.data.success) {
        setSuppliers(response.data.transactions);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  // Remove supplier
  const handleRemoveSupplier = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/supplier/remove",
        { id },
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchSuppliers(); // Refresh the list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove supplier");
    }
  };

  // Calculate total amount for a supplier
  const calculateTotalAmount = (rawMaterials) => {
    return rawMaterials.reduce((total, material) => total + material.totalAmount, 0);
  };

  // Calculate total remaining amount for a supplier
  const calculateRemainingAmount = (rawMaterials) => {
    return rawMaterials.reduce((total, material) => total + material.remainingAmount, 0);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Supplier Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showAddForm ? "Hide Add Form" : "Add New Supplier"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddSupplier token={token} onSuccess={() => {
            fetchSuppliers();
            setShowAddForm(false);
          }} />
        </div>
      )}

      <div className="grid gap-4">
        {suppliers.map((supplier) => (
          <div
            key={supplier._id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{supplier.supplierName}</h2>
                <p className="text-gray-600">
                  Added on: {new Date(supplier.purchaseDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRemoveSupplier(supplier._id)}
                className="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white"
              >
                Remove
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>Total Amount: ₹{calculateTotalAmount(supplier.rawMaterials)}</p>
                  <p>Remaining Amount: ₹{calculateRemainingAmount(supplier.rawMaterials)}</p>
                </div>
                <div>
                  <p>Total Materials: {supplier.rawMaterials.length}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Raw Materials</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Material</th>
                      <th className="px-4 py-2 text-right">Quantity</th>
                      <th className="px-4 py-2 text-right">Price/Unit</th>
                      <th className="px-4 py-2 text-right">Total</th>
                      <th className="px-4 py-2 text-right">Paid</th>
                      <th className="px-4 py-2 text-right">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.rawMaterials.map((material, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{material.materialName}</td>
                        <td className="px-4 py-2 text-right">{material.quantity}</td>
                        <td className="px-4 py-2 text-right">₹{material.pricePerUnit}</td>
                        <td className="px-4 py-2 text-right">₹{material.totalAmount}</td>
                        <td className="px-4 py-2 text-right">₹{material.amountPaid}</td>
                        <td className="px-4 py-2 text-right">₹{material.remainingAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}

        {suppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No suppliers found. Add your first supplier using the button above.
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierManagement;
